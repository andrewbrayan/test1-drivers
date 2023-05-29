import { Controller, Get, Post, Param, Body, Res } from "@nestjs/common";
import { DriverService } from './driver.service';
import { CreateDriverDto } from "./dto/create-driver.dto";
import { Response } from "express";
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { requestResponse } from 'src/shared/models/general.models';

@Controller('driver')
@ApiTags('Drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @ApiBody({
    type: CreateDriverDto,
    description: 'To create a new driver, a driver params object must be sent in the body of the request to the corresponding endpoint.'
  })
  @ApiOkResponse({ type: requestResponse })
  async createNewDriver(@Body() driverParams: CreateDriverDto, @Res() res: Response) {
    const requestResponse = await this.driverService.createNewDriver(driverParams)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }

  @Get()
  @ApiOkResponse({ type: requestResponse })
  async getDrivers(@Res() res: Response) {
    const requestResponse = await this.driverService.getDrivers()
    return res.status(requestResponse.statusCode).send(requestResponse);
  }

  @Get(':driverLegalId')
  @ApiParam({
    name: "driverLegalId",
    type: 'string',
    description: 'Retrieves a specific driver based on the provided driver ID.',
  })
  @ApiOkResponse({ type: requestResponse })
  async getDriver(@Param('driverLegalId') driverLegalId: string, @Res() res: Response) {
    const requestResponse = await this.driverService.getDriver(driverLegalId)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }
}
