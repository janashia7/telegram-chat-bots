import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger.js';
dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const DB_URI = process.env.DB_URI;
const connect = async () => {
  let connected = false;
  do {
    try {
      await mongoose.connect(DB_URI);
      connected = true;
    } catch (err) {
      logger.error(err);
      await sleep(2000);
    }
  } while (!connected);
};
export default connect;
