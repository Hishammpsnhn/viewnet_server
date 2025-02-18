import mongoose from "mongoose";


const activeUserSchema = new mongoose.Schema({
  hour: Number, 
  count: Number,
}, { timestamps: true });

const ActiveUser = mongoose.model("ActiveUser", activeUserSchema);
export default ActiveUser;