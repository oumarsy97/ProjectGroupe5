import express from 'express';
import { config } from 'dotenv';
import setupSwagger from './utils/swagger.js';
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


// Importation de Swagger
import { swaggerUi, swaggerSpec } from './swaggerConfig.js';

// Charger les variables d'environnement
config();

connectDB();



const app = express();
app.use(express.json());
config();
app.use(express.urlencoded({ extended: true }));

// Routes de l'API
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/post`, PostRoute);
app.use(`${process.env.BASE_URL}/follower`, FollowRoute);
app.use(`${process.env.BASE_URL}/report`, ReportRoute);
app.use(`${process.env.BASE_URL}/discussions`, DiscussionRoute);
app.use(`${process.env.BASE_URL}/chat`, ChatRoute);
app.use(`${process.env.BASE_URL}/story`, StoryRoute);
 
// Route pour Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
   
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
 
 // Swagger
 setupSwagger(app);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`day mboli rek http://localhost:${port}/api-docs`);
    
});
