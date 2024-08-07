import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './config/database.js';
import UserRoute from './Route/UserRoute.js';
import PostRoute from './Route/PostRoute.js';
import FollowRoute from './Route/FollowRoute.js';

connectDB();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/follower`, FollowRoute);
app.use(`${process.env.BASE_URL}/post`, PostRoute);



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}) 