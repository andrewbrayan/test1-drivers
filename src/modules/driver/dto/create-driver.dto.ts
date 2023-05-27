export class CreateDriverDto {
  readonly full_name: string;
  readonly customer_email: string;
  readonly legal_id: string;
  readonly ledal_id_type: string;
  readonly current_location: [number, number];
}
