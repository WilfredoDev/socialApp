import express from "express";
import {verifyToken} from "../middleware/auth.middleware.js";
import {getFeedPosts, getUserPosts, likePost, commentPost} from "../controllers/posts.controller.js"

const router = express.Router();

router.get('/', verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE*/
router.patch("/:id/like",verifyToken, likePost);
router.patch("/:id/comment",verifyToken, commentPost);

export default router