import moongose, { Document, Schema } from 'mongoose';

export interface ICar extends Document {
  brand: string;
  carModel: string;
  color: string;
  specs?: string[];
  year: number;
}

const CarSchema: Schema = new Schema({
  brand: { type: String, required: true },
  carModel: { type: String, required: true },
  color: { type: String, required: true },
  specs: [{ type: String }],
  year: { type: Number, required: true },
});

export const Car = moongose.model<ICar>('Car', CarSchema);
