import dotenv from "dotenv";
import connectDB from "../database/setup";
dotenv.config();

async function init() {
  connectDB();
}

export default { init };
