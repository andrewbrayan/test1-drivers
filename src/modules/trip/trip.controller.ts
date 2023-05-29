import { Body, Controller, Post, Patch, Param, Res } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { Response } from 'express';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { requestResponse } from 'src/shared/models/general.models';

@Controller('trip')
@ApiTags('Trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @ApiBody({
    type: CreateTripDto,
    description: 'Starts a new trip by providing the necessary trip details in the request body.'
  })
  @ApiOkResponse({ type: requestResponse })
  async startTrip(@Body() createTripDto: CreateTripDto, @Res() res: Response) {
    const requestResponse = await this.tripService.startTrip(createTripDto)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }

  @Patch(':driverLegal_id')
  @ApiParam({
    name: "driverLegal_id",
    type: 'string',
    description: 'Closes an ongoing trip for the specified driver based on their legal ID.',
  })
  @ApiOkResponse({ type: requestResponse })
  async closeTrip(@Param('driverLegal_id') driverLegalId: string, @Res() res: Response) {
    const requestResponse = await this.tripService.closeTrip(driverLegalId)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }
}
