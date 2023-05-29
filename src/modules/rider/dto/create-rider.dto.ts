import { ApiProperty } from "@nestjs/swagger";

export class CreateRiderDto {
  @ApiProperty()
  readonly full_name: string;

  @ApiProperty()
  readonly customer_email: string;

  @ApiProperty()
  readonly legal_id: string;

  @ApiProperty()
  readonly ledal_id_type: string;
}
