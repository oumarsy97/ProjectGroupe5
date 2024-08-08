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
            if (story.author != iduser) return res.status(400).json({ message: "you can't delete this story", data: null, status: false });
            const deleteStory = await Story.findByIdAndDelete(id);
            res.status(200).json({ message: "Story deleted successfully", data: deleteStory, status: false });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };

}