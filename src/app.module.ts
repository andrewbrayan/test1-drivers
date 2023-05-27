import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { RiderModule } from "./modules/rider/rider.module";
import { DriverModule } from './modules/driver/driver.module';
import { PaymentModule } from './modules/payment/payment.module';

//*! normalmente las credenciales de la base de datos se obtendria atraves de los environments.
//*! debido a ser un test de dejan quemados directamente.
@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://administrator:i8Izwzcy51I4Y9bk@drivers-test.nscpx2a.mongodb.net/drivers?retryWrites=true&w=majority"
    ),
    RiderModule,
    DriverModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
