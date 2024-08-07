import express from 'express';
import { config } from 'dotenv';
import connectDB from './config/database.js';
import UserRoute from './Route/UserRoute.js';
import PostRoute from './Route/PostRoute.js';
import FollowRoute from './Route/FollowRoute.js';
import DiscussionRoute from './Route/DiscussionRoute.js';
// import ChatRoute from './Route/ChatRoute.js';

config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/post`, PostRoute);
app.use(`${process.env.BASE_URL}/follower`, FollowRoute);
app.use(`${process.env.BASE_URL}/discussions`, DiscussionRoute);
// app.use(`${process.env.BASE_URL}/chat`, ChatRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
