"use strict";

import env from "../config/environment";

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.DATABASE_URL as string);

    console.log(
      `🍃 [database] Established connection with MongoDB @ ${conn.connection.host}`
    );
  } catch (error) {
    console.error(
      `🍃 [database] ${error instanceof Error ? error.message : error}`
    );
    console.log("Are you sure MongoDB is running?");
    process.exit(1);
  }
};

export default connectDB;
