import { Story, validateStory } from "../Model/Story.js";

export default class StoryController {
    static create = async (req, res) => {
        const { error } = validateStory(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message, data: null, status: false });
        const { title, description, content } = req.body;
        const author = req.userId;
        console.log(author);
        try {
            const newStory = await Story.create({ title, description, content, author });
            res.status(201).json({ message: "Story create successfully", data: newStory, status: false });
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
            const deleteStory = await Story.findByIdAndDelete(id);
            res.status(200).json({ message: "Story deleted successfully", data: deleteStory, status: false });
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
}