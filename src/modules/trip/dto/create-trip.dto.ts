export class CreateTripDto {
  readonly rider_legal_id: string;
  readonly destination: [number, number];
  readonly origin: [number, number];
}

