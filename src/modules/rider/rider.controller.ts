import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Res,
} from "@nestjs/common";
import { RiderService } from "./rider.service";
import { CreateRiderDto } from "./dto/create-rider.dto";
import { Response } from "express";

@Controller("rider")
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  async createNewRider(@Body() riderParams: CreateRiderDto, @Res() res: Response) {
    const requestResponse = await this.riderService.createNewRider(riderParams)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }

  @Get()
  async getRiders(@Res() res: Response) {
    const requestResponse = await this.riderService.getRiders()
    return res.status(requestResponse.statusCode).send(requestResponse);
  }

  @Get(':id')
  async getRider(@Param('id') riderLegalId: string, @Res() res: Response) {
    const requestResponse = await this.riderService.getRider(riderLegalId)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }
}
