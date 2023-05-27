import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Res,
} from "@nestjs/common";
import { DriverService } from './driver.service';
import { CreateDriverDto } from "./dto/create-driver.dto";
import { Response } from "express";

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  async createNewDriver(@Body() driverParams: CreateDriverDto, @Res() res: Response) {
    const requestResponse = await this.driverService.createNewDriver(driverParams)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }

  @Get()
  async getDrivers(@Res() res: Response) {
    const requestResponse = await this.driverService.getDrivers()
    return res.status(requestResponse.statusCode).send(requestResponse);
  }

  @Get(':id')
  async getDriver(@Param('id') driverLegalId: string, @Res() res: Response) {
    const requestResponse = await this.driverService.getDriver(driverLegalId)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }
}
