import { Body, Controller, Post, Patch, Param, Res } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { Response } from 'express';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  async startTrip(@Body() createTripDto: CreateTripDto, @Res() res: Response) {
    const requestResponse = await this.tripService.startTrip(createTripDto)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }

  @Patch(':id')
  async closeTrip(@Param('id') driverLegalId: string, @Res() res: Response) {
    const requestResponse = await this.tripService.closeTrip(driverLegalId)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }
}
