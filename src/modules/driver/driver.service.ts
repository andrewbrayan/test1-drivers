import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Driver, DriverDocument } from './schemas/driver.schema';
import { Model } from 'mongoose';
import { requestResponse } from 'src/shared/models/general.models';

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<DriverDocument>
  ) {}

  async createNewDriver(driverParams: CreateDriverDto): Promise<requestResponse> {
    const newDriver = new this.driverModel(driverParams);

    const driver = await this.driverModel.findOne({ legal_id: driverParams.legal_id })

    if (driver && driver.legal_id == driverParams.legal_id) {
      return {
        statusCode: 409,
        status: "Conflict",
        message: `El conductor ${driver.legal_id} ya está en uso`,
        data: null,
      };
    }

    return await newDriver
      .save()
      .then<requestResponse>((driver) => {
        return {
          statusCode: 200,
          status: "Created",
          message: "Conductor creado",
          data: driver,
        };
      })
      .catch<requestResponse>((error) => {
        return {
          statusCode: 400,
          status: "Bad Request",
          message: "Error al crear el conductor",
          data: error,
        };
      });
  }

  async getDrivers(): Promise<requestResponse> {
    const allDrivers = await this.driverModel.find();
    if (!allDrivers.length) {
      return {
        statusCode: 400,
        status: "Bad Request",
        message: "No existen conductores en el sistema",
        data: null,
      };
    }

    return {
      statusCode: 200,
      status: "Accepted",
      message: `${allDrivers.length}, conductores encontrados`,
      data: allDrivers,
    };
  }

  async getDriver(driverLegalId: string) {
    const driver = await this.driverModel.findOne({ legal_id: driverLegalId });
    if (!driver) {
      return {
        statusCode: 400,
        status: "Bad Request",
        message: "No existen este conductor en el sistema",
        data: null,
      };
    }

    return {
      statusCode: 200,
      status: "Accepted",
      message: `${driver.full_name}, encontrado`,
      data: driver,
    };
  }
}
