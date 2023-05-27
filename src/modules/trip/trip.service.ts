import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Trip, TripDocument } from "./schemas/trip.schema";
import { CreateTripDto } from "./dto/create-trip.dto";
import { Model } from "mongoose";
import { MapboxService } from "src/shared/services/mapbox/mapbox.service";
import { requestResponse } from "src/shared/models/general.models";
import { Driver, DriverDocument } from "../driver/schemas/driver.schema";
import { Rider, RiderDocument } from "../rider/schemas/rider.schema";

@Injectable()
export class TripService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
    @InjectModel(Rider.name) private riderModel: Model<RiderDocument>,
    private mapboxService: MapboxService
  ) {}

  async createTrip(createTripDto: CreateTripDto): Promise<requestResponse> {
    if (
      !createTripDto.origin ||
      !createTripDto.destination ||
      !createTripDto.rider_legal_id
    ) {
      return {
        statusCode: 400,
        status: "Bad Request",
        message: "Los campos 'rider_id', 'destination' y 'origin' son requeridos.",
        data: null,
      };
    }

    const rider = await this.riderModel.findOne({
      legal_id: createTripDto.rider_legal_id,
    });
    if (!rider) {
      return {
        statusCode: 400,
        status: "Bad Request",
        message: "El pasajero seleccionado no existen el sistema",
        data: null,
      };
    }

    const getDirectionsResponse = await this.mapboxService.getDirections(
      createTripDto.origin,
      createTripDto.destination
    );

    const [{ duration, distance, geometry }] = getDirectionsResponse.routes;
    const selectDriver = await this.calculateShortDrivers(createTripDto.origin);

    const newTrip = new this.tripModel({
      ...createTripDto,
      driver_legal_id: selectDriver.legal_id,
      route_distance: distance,
      route_duration: duration,
      route_coordinates: geometry.coordinates,
    });

    return await newTrip
      .save()
      .then<requestResponse>((trip) => {
        return {
          statusCode: 200,
          status: "Created",
          message: "Viaje creado",
          data: trip,
        };
      })
      .catch<requestResponse>((error) => {
        return {
          statusCode: 400,
          status: "Bad Request",
          message: "Error al crear el viaje",
          data: error,
        };
      });
  }

  async calculateShortDrivers(origin: [number, number]) {
    const allDrivers = await this.driverModel.find();
    let minDistance = null;
    let selectDriver: Driver;

    for (const driver of allDrivers) {
      const getDirectionsResponse = await this.mapboxService.getDirections(
        origin,
        driver.current_location
      );

      const [{ distance }] = getDirectionsResponse.routes;

      if (!minDistance || distance < minDistance) {
        minDistance = distance;
        selectDriver = driver;
      }
    }

    return selectDriver;
  }
}
