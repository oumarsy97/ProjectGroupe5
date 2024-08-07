import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './config/database.js';
import UserRoute from './Route/UserRoute.js';
import PostRoute from './Route/PostRoute.js';
import FollowRoute from './Route/FollowRoute.js';
import StoryRoute from './Route/StoryRoute.js';
import Messenger from './utils/Messenger.js';
// Messenger.sendSms('0676960964', 'Seydina', 'Hello from Tailor Digital');
// Messenger.sendMail('issadiol99@gmail.com', 'Seydina', 'Hello from Tailor Digital');
//  Messenger.sendWhatsapp('0676960964', 'Seydina', 'Hello from Tailor Digital');
connectDB();

 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/post`, PostRoute);
app.use(`${process.env.BASE_URL}/follower`, FollowRoute);
app.use(`${process.env.BASE_URL}/post`, PostRoute);
app.use(`${process.env.BASE_URL}/story`, StoryRoute);



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})   