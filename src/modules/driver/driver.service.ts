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

    const userResponse = await this.driverModel
      .find({ legal_id: driverParams.legal_id })
      .exec();
    if (userResponse.length) {
      return {
        statusCode: 409,
        status: "Conflict",
        message: `El conductor ${userResponse[0].legal_id} ya está en uso`,
        data: null,
      };
    }

    return await newDriver
      .save()
      .then<requestResponse>((rider) => {
        return {
          statusCode: 200,
          status: "Created",
          message: "Conductor creado",
          data: rider,
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
