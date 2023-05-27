import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from './schemas/driver.schema';

@Module({
  controllers: [DriverController],
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema }
    ]),
  ],
  providers: [DriverService]
})
export class DriverModule {}
