import express from 'express';
import { config } from 'dotenv';
import connectDB from './config/database.js';
import UserRoute from './Route/UserRoute.js';
import FollowRoute from './Route/FollowRoute.js';
import ChatRoute from './Route/ChatRoute.js';   
import ReportRoute from './Route/ReportRoute.js';
import PostRoute from './Route/PostRoute.js';
import StoryRoute from './Route/StoryRoute.js';
import Messenger from './utils/Messenger.js';
import cron from 'node-cron';
import { Story } from './Model/Story.js';
import DiscussionRoute from './Route/DiscussionRoute.js';

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/post`, PostRoute);
app.use(`${process.env.BASE_URL}/follower`, FollowRoute);
app.use(`${process.env.BASE_URL}/report`, ReportRoute);
app.use(`${process.env.BASE_URL}/discussions`, DiscussionRoute);
app.use(`${process.env.BASE_URL}/chat`, ChatRoute);
app.use(`${process.env.BASE_URL}/story`, StoryRoute);
 
cron.schedule('0 * * * *', async () => { 
    try {
        console.log('Deleting expired stories...'); 
        const now = new Date();
        const result = await Story.deleteMany({ createdAt: { $lt: new Date(now - 24 * 60 * 60 * 1000) } });
        console.log(`Deleted ${result.deletedCount} expired stories`);
    } catch (error) {
        console.error('Error deleting expired stories:', error);
    }
}); 

 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});