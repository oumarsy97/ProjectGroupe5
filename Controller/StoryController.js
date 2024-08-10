import { Story, validateStory } from "../Model/Story.js";
import { Follow } from "../Model/Follow.js";
import { User } from "../Model/User.js";

export default class StoryController {
    static create = async (req, res) => {
        const { title, description } = req.body;
        const author = req.userId;

        // Récupérer les chemins des fichiers
        const content = req.files.map(file => file.path);

        const { error } = validateStory({ title, description, content });
        if (error) return res.status(400).json({ message: error.details[0].message, data: null, status: false });

        try {
            const newStory = await Story.create({ title, description, content, author });
            res.status(201).json({ message: "Story created successfully", data: newStory, status: true });
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    };

    static deleteStory = async (req, res) => {
        try {
            const { idStory } = req.params;
            const iduser = req.userId;
            const story = await Story.findById(idStory);
            if (!story) {
                return res.status(404).json({ message: "Story not found", data: null, status: false });
            }

            if (story.author != iduser) return res.status(400).json({ message: "you can't delete this story", data: null, status: false });
            const deleteStory = await Story.findByIdAndDelete(idStory);
            res.status(200).json({ message: "Story deleted successfully", data: deleteStory, status: true });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };

    static viewStory = async (req, res) => {
        try {
            const { idStory } = req.params;
            const viewerId = req.userId;

            const story = await Story.findById(idStory);
            if (!story) {
                return res.status(404).json({ message: "Story not found", data: null, status: false });
            }

            // Vérifier si le viewer n'est pas l'auteur du story
            if (story.author.toString() === viewerId) {
                return res.status(400).json({ message: "You can't view your own story", data: null, status: false });
            }

            // Incrémenter le nombre de vues
            story.views += 1;
            await story.save();

            res.status(200).json({
                message: "Story viewed successfully",
                data: { views: story.views },
                status: true
            });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };

    // Méthode pour obtenir le nombre de vues d'un story
    static getStoryViews = async (req, res) => {
        try {
            const { idStory } = req.params;
            const userId = req.userId;

            const story = await Story.findById(idStory);
            if (!story) {
                return res.status(404).json({ message: "Story not found", data: null, status: false });
            }

            // Vérifier si l'utilisateur est l'auteur du story
            if (story.author.toString() !== userId) {
                return res.status(403).json({ message: "You are not authorized to see this information", data: null, status: false });
            }

            res.status(200).json({
                message: "Story views retrieved successfully",
                data: { views: story.views },
                status: true
            });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };

 
    //mes stories
    static getMyStories = async (req, res) => {
        try {
            const iduser = req.userId;
            const stories = await Story.find({ author: iduser });
            res.status(200).json({ message: "Stories fetched successfully", data: stories, status: false });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
    //toutes les stories
    static getAllStories = async (req, res) => {
        try {
            const stories = await Story.find();
            res.status(200).json({ message: "Stories fetched successfully", data: stories, status: false });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };

    static getMyFollowingStories = async (req, res) => {
        try {
            const idUser = req.userId;
            const user = await User.findById(idUser);
    
            // Récupérer tous les tailors suivis par l'utilisateur
            let followeds = await Follow.find({ followerId: idUser }).select('followedId');
            console.log(followeds);
            let tailorIds = [];
    
            // Extraire les IDs des tailors suivis
            tailorIds.push(...followeds.map(follow => follow.followedId));
    
            // Si l'utilisateur est un tailor, ajouter son propre ID à la liste des tailors suivis
            if (user.role === 'tailor') {
                tailorIds.push(user._id);
            }
    
            // Récupérer toutes les stories des tailors suivis
            let stories = [];
            if (tailorIds.length > 0) {
                stories = await Story.find({ author: { $in: tailorIds } });
            } 
            res.status(200).json({ message: "Stories fetched successfully", data: stories, status: true });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
    

} 