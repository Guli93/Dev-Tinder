const express =require('express');
const {auth}=require('../middlewares/auth');
const Chats = require('../model/chats');


const chatRouter= express.Router();

chatRouter.get('/chat/:targetUserId', auth, async(req,res)=>{
    try{
        const {targetUserId}=req.params;
        const loggedInUserId=req.user._id;
        const allChats= await Chats.findOne({
            participants: { $all: [loggedInUserId, targetUserId] }
        }).populate({
            path:"messages.userId",
            select:"name"
        })

        res.send(allChats);
    }catch(err){
        res.status(400).send(err);
    }
   
})

module.exports=chatRouter;