'use strict';

import env from '../config/environment.js';

import mongoose from 'mongoose';
import subscriptionCron from '../cron/subscriptionCron.js'
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.DATABASE_URL);
        subscriptionCron();
        console.log(`🍃 [database] Established connection with MongoDB @ ${conn.connection.host}`);
    } catch (error) {
        console.error(`🍃 [database]  ${error.message}`);
        console.log("Are you sure MongoDB is running?");
        process.exit(1);
    }
};

export default connectDB;