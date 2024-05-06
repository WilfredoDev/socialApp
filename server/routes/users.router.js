import express from "express";
import {
    getUser,
    getUserFriends,
    removeFriend,
    addFriend
} from "../controllers/user.controller.js";
import {verifyToken} from "../middleware/auth.middleware.js";

const router = express.Router();

/*READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/:id/:friendId/add", verifyToken, addFriend);
router.patch("/:id/:friendId/remove", verifyToken, removeFriend);

export default router;