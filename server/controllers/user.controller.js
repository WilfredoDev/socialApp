import e from "express";
import User from "../models/user.model.js";

/* READ*/

export const getUser = async(req,res) =>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(err){
        res.status(404).json({message: err.message});
    }
}

export const getUserFriends = async(req, res) =>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);

        const friends  = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        );
        if(friends.length == 0){
            res.status(200).json(friends);
        }else{
            const formattedFriends = friends.map(({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {
                    _id,
                    firstName,
                    lastName,
                    occupation,
                    location,
                    picturePath
                };
            });
            res.status(200).json([formattedFriends]);
        }
    }catch(err){
        res.status(404).json({message: err.message});
    }
}

/* UPDATE */
export const removeFriend = async(req,res)=>{
    try {
        const {id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=>id !==friendId);
            friend.friends = friend.friends.filter((id)=>id !==id);
            await user.save();
            await friend.save();
            
            const friends  = await Promise.all(
                user.friends.map((id)=>User.findById(id))
            );
            const formattedFriends = friends.map(({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {
                    _id,
                    firstName,
                    lastName,
                    occupation,
                    location,
                    picturePath
                };
            });
            res.status(200).json(formattedFriends);
        }else{
            res.status(404).json({message: "This Person is not your Friend"});
        }

    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const addFriend = async(req, res) =>{
    const {id, friendId} = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if(user.friends.includes(friendId)){
        res.status(500).json({message:"This person is already your friend"});
    }else{
        user.friends.push(friendId);
        friend.friends.push(id);
        await user.save();
        await friend.save();
        
        const friends  = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        );
        const formattedFriends = friends.map(({_id, firstName, lastName, occupation, location, picturePath}) => {
            return {
                _id,
                firstName,
                lastName,
                occupation,
                location,
                picturePath
            };
        });
        res.status(200).json(formattedFriends);
    }
}