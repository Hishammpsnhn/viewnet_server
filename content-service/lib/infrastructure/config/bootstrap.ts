import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../database/setup';

async function init() {
    connectDB();
  
}

export default { init };