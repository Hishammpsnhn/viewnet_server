import { Schema, model, Document } from "mongoose";
import { ResolutionEntity } from "../../../../domain/entities/series/episodeCatalog";

export interface IResolutionDocument extends Omit<Document, "id">, ResolutionEntity {}

const resolutionSchema = new Schema(
  {
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode", required: true }, 
    key: { type: String, required: true ,unique: true }, 
    resolutions: [
      {
        resolution: {
          type: String,
          required: true,
          enum: ["1080p", "720p", "480p", "360p", "auto"], 
        },
        fileUrl: { type: String, required: true }, 
        format: { type: String, required: true }, 
      },
    ],
  },
  { timestamps: true }
);

const ResolutionModel = model<IResolutionDocument>("Resolution", resolutionSchema);

export default ResolutionModel;
