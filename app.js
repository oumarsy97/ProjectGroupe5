import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './config/database.js';
connectDB();
 
const app = express();
const port = process.env.PORT || 3000; 