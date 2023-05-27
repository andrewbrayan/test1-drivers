import { Module } from "@nestjs/common";
import { RiderService } from "./rider.service";
import { RiderController } from "./rider.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Rider, RiderSchema } from "./schemas/rider.schema";

@Module({
  controllers: [RiderController],
  imports: [
    MongooseModule.forFeature([
      { name: Rider.name, schema: RiderSchema }
    ]),
  ],
  providers: [RiderService],
})
export class RiderModule {}
