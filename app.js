import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './config/database.js';
import UserRoute from './Route/UserRoute.js';
import FollowRoute from './Route/FollowRoute.js';
import ReportRoute from './Route/ReportRoute.js';
import PostRoute from './Route/PostRoute.js';
import StoryRoute from './Route/StoryRoute.js';
import Messenger from './utils/Messenger.js';
import cron from 'node-cron';
import { Story } from './Model/Story.js';
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
app.use(`${process.env.BASE_URL}/report`, ReportRoute);
app.use(`${process.env.BASE_URL}/story`, StoryRoute);

cron.schedule('0 * * * *', async () => {
    try {
        console.log('Deleting expired stories...'); 
        const now = new Date();
        const result = await Story.deleteMany({ createdAt: { $lt: new Date(now - 30) } });
        console.log(`Deleted ${result.deletedCount} expired stories`);
    } catch (error) {
        console.error('Error deleting expired stories:', error);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});