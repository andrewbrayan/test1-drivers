import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Trip, TripDocument } from "./schemas/trip.schema";
import { CreateTripDto } from "./dto/create-trip.dto";
import { Model } from "mongoose";
import { MapboxService } from "src/shared/services/mapbox/mapbox.service";
import { requestResponse } from "src/shared/models/general.models";
import { Driver, DriverDocument } from "../driver/schemas/driver.schema";
import { Rider, RiderDocument } from "../rider/schemas/rider.schema";
import { PaymentsService } from "src/shared/services/payments/payments.service";

@Injectable()
export class TripService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
    @InjectModel(Rider.name) private riderModel: Model<RiderDocument>,
    private mapboxService: MapboxService,
    private paymentsService: PaymentsService
  ) {}

  async startTrip(createTripDto: CreateTripDto): Promise<requestResponse> {
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

  async closeTrip(legal_id: string): Promise<requestResponse> {
    if (!legal_id) {
      return {
        statusCode: 400,
        status: "Bad Request",
        message: "Es requerido ingresar como parametro la identificación del conductor",
        data: null,
      };
    }

    const trip = await this.tripModel.findOne({ driver_legal_id: legal_id,  payment_reference: '' });
    if (!trip) {
      return {
        statusCode: 400,
        status: "Bad Request",
        message: "El viaje solicitado no ha sido encontrado",
        data: null,
      };
    }

    const rider = await this.riderModel.findOne({ legal_id: trip.rider_legal_id });
    const amount = this.calculateAmount(trip.route_distance, trip.route_duration)
    const paymentRefence = await this.paymentsService.createPayment(rider, amount);

    return await this.tripModel.updateOne(
      { _id: trip._id }, 
      { payment_reference: paymentRefence, payment_amount: Math.ceil(amount) }
    ).then<requestResponse>((trip) => {
      return {
        statusCode: 200,
        status: "Created",
        message: "Viaje finalizado",
        data: null,
      };
    })
    .catch<requestResponse>((error) => {
      return {
        statusCode: 400,
        status: "Bad Request",
        message: "Error al finalizar el viaje",
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

  calculateAmount(distance: number, duration: number): number {
    const kilometersCost = (distance/1000) * 1000;
    const durationCost = (distance/60) * 200;
    const baseCost = 3500

    return kilometersCost + durationCost + baseCost
  }
}
