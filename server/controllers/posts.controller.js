import Post  from '../models/post.model.js';
import User from "../models/user.model.js";

/*Create */
export const createPost = async(req, res)=>{
    try {
        const {userId, description, picturePath} = req.body;
        const user  = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName : user.lastName,
            location : user.location,
            description,
            picturePath,
            likes:{},
            comments:[]
        });
        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);
    } catch (error) {
        res.status(409).json({message: error.message})
    }
};

/* READ */
export const getFeedPosts = async(req,res)=>{
    try{
        const posts = await Post.find();
        res.status(200).json(posts);
    }catch(error){
        res.status(404).json({message:err.message})
    }
}

export const getUserPosts = async(req,res)=>{
    try{
        const {userId} = req.params;
        const posts =  await Post.find({userId});
        res.status(200).json(posts);
    }catch(error){
        res.status(404).json({message:err.message})
    }
}

/* UPDATE */

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        isLiked ? post.likes.delete(userId) : post.likes.set(userId, true);
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
} 

export const commentPost = async(req,res) =>{
    try{
        const {id} = req.params;
        const {userId, description} = req.body;
        const post = await Post.findById(id);
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { comments: [...post.comments, {user:userId,comment:description, date:new Date()}]},
            {new:true}
        );
        res.status(200).json(updatedPost);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}
