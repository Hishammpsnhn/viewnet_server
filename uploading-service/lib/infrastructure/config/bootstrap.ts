import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../database/setup';
import movieReleaseCron from '../cron/releasemovieCron';

async function init() {
    connectDB();
    movieReleaseCron()
}

export default { init };