import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RiderDocument = HydratedDocument<Rider>;

@Schema()
export class Rider {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  customer_email: string;

  @Prop({ required: true })
  legal_id: string;

  @Prop({ required: true })
  ledal_id_type: string;
}

export const RiderSchema = SchemaFactory.createForClass(Rider);
