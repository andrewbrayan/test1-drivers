import { ApiProperty } from "@nestjs/swagger";

export class requestResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  status:
    | "OK"
    | "Created"
    | "Accepted"
    | "Bad Request"
    | "Conflict"
    | "Unauthorized";

  @ApiProperty()
  message: string;

  @ApiProperty({
    description: "La data puede tener muchos tipos de valor.",
  })
  data: any;
}
