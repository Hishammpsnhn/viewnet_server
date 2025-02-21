import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../database/setup.js';

async function init() {
    connectDB();
  
}

export default { init };