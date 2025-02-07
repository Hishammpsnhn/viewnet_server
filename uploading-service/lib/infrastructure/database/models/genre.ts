import mongoose, { Schema, Document } from "mongoose";

export interface GenreDocument extends Document {
  _id: string;
  name: string; 
  description?: string; 
  isActive: boolean; 
}

const genreSchema = new Schema<GenreDocument>(
  {
    
    name: { type: String, required: true ,unique: true},
    description: { type: String },
    isActive:{ type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

genreSchema.index({ name: 1 }, { unique: true });

export const GenreModel = mongoose.model<GenreDocument>("Genre", genreSchema);
