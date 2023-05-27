import { Body, Controller, Post, Res } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { Response } from 'express';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  async createTrip(@Body() createTripDto: CreateTripDto, @Res() res: Response) {
    const requestResponse = await this.tripService.createTrip(createTripDto)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }
}
