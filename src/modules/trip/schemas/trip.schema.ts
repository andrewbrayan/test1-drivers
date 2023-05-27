import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TripDocument = HydratedDocument<Trip>;

@Schema()
export class Trip {
  @Prop({ required: true })
  rider_legal_id: string;

  @Prop({ required: true })
  driver_legal_id: string;

  @Prop({ required: true })
  destination: [number, number];

  @Prop({ required: true })
  origin: [number, number];

  @Prop({ required: true })
  route_distance: number;

  @Prop({ required: true })
  route_duration: number;

  @Prop({ required: true })
  route_coordinates: number[][];

  @Prop({ required: false, default: 0 })
  payment_amount: number;

  @Prop({ required: false, default: '' })
  payment_reference: string;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
