import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DriverDocument = HydratedDocument<Driver>;

@Schema()
export class Driver {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  customer_email: string;

  @Prop({ required: true })
  legal_id: string;

  @Prop({ required: true })
  ledal_id_type: string;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
