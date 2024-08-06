import {Post} from '../Model/Post.js';

export default class PostController{
    static create = async (req,res)=>{  
        const {title, description, content} = req.body;
         const author = req.userId;
        try{
            const newPost = await  Post.create({title, description, content, author});
            res.status(201).json({message:"post create successfully",data:newPost,status:false});
        }catch(error){
            res.status(400).json({message: error.message,data:null,status:false});
        }
    }
}