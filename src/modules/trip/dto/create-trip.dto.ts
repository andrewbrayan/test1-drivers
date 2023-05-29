import { ApiProperty } from "@nestjs/swagger";

export class CreateTripDto {
  @ApiProperty()
  readonly rider_legal_id: string;

  @ApiProperty({
    example: [0,0]
  })
  readonly destination: [number, number];

  @ApiProperty({
    example: [0,0]
  })
  readonly origin: [number, number];
}

