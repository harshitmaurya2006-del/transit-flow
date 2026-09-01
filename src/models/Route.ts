import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoute extends Document {
  routeNumber: string;
  routeName: string;
  startLocation: string;
  endLocation: string;
  stops: string[];
  isActive: boolean;
  createdAt: Date;
}

const RouteSchema = new Schema<IRoute>(
  {
    routeNumber: { type: String, required: true, unique: true },
    routeName: { type: String, required: true },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    stops: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Route: Model<IRoute> =
  mongoose.models["Route"] || mongoose.model<IRoute>("Route", RouteSchema);

export default Route;
