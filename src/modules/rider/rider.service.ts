import { Injectable } from '@nestjs/common';
import { CreateRiderDto } from './dto/create-rider.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rider, RiderDocument } from './schemas/rider.schema';
import { Model } from 'mongoose';
import { requestResponse } from 'src/shared/models/general.models';


@Injectable()
export class RiderService {

  constructor(@InjectModel(Rider.name) private riderModel: Model<RiderDocument>) {}

  async createNewRider(riderParams: CreateRiderDto): Promise<requestResponse> {

    const newRider = new this.riderModel(riderParams);
    
    const rider = await this.riderModel.findOne({ legal_id: riderParams.legal_id })

    if (rider && rider.legal_id == riderParams.legal_id) {
      return {
        statusCode: 409,
        status: "Conflict",
        message: `El pasajero ${rider.legal_id} ya está en uso`,
        data: null,
      };
    }

    return await newRider.save().then<requestResponse>((rider) => {
      return {
        statusCode: 200,
        status: "Created",
        message: "Pasajero creado",
        data: rider,
      };
    }).catch<requestResponse>((error) => {
      return {
        statusCode: 400,
        status: "Bad Request",
        message: "Error al crear el pasajero",
        data: error,
      };
    });
  }

  async getRiders(): Promise<requestResponse> {
    const allRiders = await this.riderModel.find();
    if (!allRiders.length) {
      return {
        statusCode: 400,
        status: "Bad Request",
        message: "No existen pasajeros en el sistema",
        data: null,
      };
    }

    return {
      statusCode: 200,
      status: "Accepted",
      message: `${allRiders.length}, Pasajeros encontrados`,
      data: allRiders,
    };
  }

  async getRider(riderLegalId: string) {
    const rider = await this.riderModel.findOne({ legal_id: riderLegalId });
    if (!rider) {
      return {
        statusCode: 400,
        status: "Bad Request",
        message: "No existen este pasajero en el sistema",
        data: null,
      };
    }

    return {
      statusCode: 200,
      status: "Accepted",
      message: `${rider.full_name}, encontrado`,
      data: rider,
    };
  }
}
