import { Controller, Get, Post, Param, Body, Res } from "@nestjs/common";
import { RiderService } from "./rider.service";
import { CreateRiderDto } from "./dto/create-rider.dto";
import { Response } from "express";
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { requestResponse } from 'src/shared/models/general.models';

@Controller("rider")
@ApiTags('Riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  @ApiBody({
    type: CreateRiderDto,
    description: 'To create a new rider, a rider params object must be sent in the body of the request to the corresponding endpoint.'
  })
  @ApiOkResponse({ type: requestResponse })
  async createNewRider(@Body() riderParams: CreateRiderDto, @Res() res: Response) {
    const requestResponse = await this.riderService.createNewRider(riderParams)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }

  @Get()
  @ApiOkResponse({ type: requestResponse })
  async getRiders(@Res() res: Response) {
    const requestResponse = await this.riderService.getRiders()
    return res.status(requestResponse.statusCode).send(requestResponse);
  }

  @Get(':riderLegalId')
  @ApiParam({
    name: "riderLegalId",
    type: 'string',
    description: 'Retrieves a specific rider based on the provided rider ID.',
  })
  @ApiOkResponse({ type: requestResponse })
  async getRider(@Param('riderLegalId') riderLegalId: string, @Res() res: Response) {
    const requestResponse = await this.riderService.getRider(riderLegalId)
    return res.status(requestResponse.statusCode).send(requestResponse);
  }
}
