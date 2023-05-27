import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { Trip, TripSchema } from './schemas/trip.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from "@nestjs/axios";
import { MapboxService } from 'src/shared/services/mapbox/mapbox.service';
import { Driver, DriverSchema } from '../driver/schemas/driver.schema';
import { Rider, RiderSchema } from '../rider/schemas/rider.schema';

@Module({
  controllers: [TripController],
  imports: [
    MongooseModule.forFeature([
      { name: Trip.name, schema: TripSchema },
      { name: Driver.name, schema: DriverSchema },
      { name: Rider.name, schema: RiderSchema }
    ]),
    HttpModule
  ],
  providers: [TripService, MapboxService]
})
export class TripModule {}
