import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class MapboxService {
  constructor(private httpService: HttpService) {}

  async getDirections(
    LngLatFrom: [number, number],
    LngLatTo: [number, number]
  ) {
    const [lngFrom, latFrom] = LngLatFrom;
    const [lngTo, latTo] = LngLatTo;
    const parameters = `${lngFrom},${latFrom};${lngTo},${latTo}?alternatives=false&geometries=geojson&overview=full&steps=false&`;
    const token = `access_token=${process.env.MAPBOX_APIKEY}`;
    return (
      await firstValueFrom(
        this.httpService.get(process.env.MAPBOX_URI + parameters + token)
      )
    ).data;
  }
}
