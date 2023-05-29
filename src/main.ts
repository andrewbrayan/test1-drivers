import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule } from "@nestjs/swagger";
import { DocumentBuilder } from "@nestjs/swagger/dist";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("WompiTest Drivers REST API")
    .setDescription(
      `This is a RESTful JSON API built for a small ride-hailing service. It integrates with the Wompi API for monetary transactions. The API supports two types of users: riders and drivers. Riders can create payment methods, request rides, and view their transaction history. Drivers can finish rides, calculate fares, and create transactions. The API is built using NESTJS Framework.`
    )
    .setVersion("1.0")
    .addTag("Drivers")
    .addTag("Riders")
    .addTag("Trips")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
