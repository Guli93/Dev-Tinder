const express=require('express');
const connectionRequest=require('../model/connectionRequest');
const {auth}=require('../middlewares/auth');
const User=require('../model/user');

const requestRouter=express.Router();

requestRouter.post('/request/send/:status/:toUserId',auth, async (req,res)=>{
    try{
        const toUserId=req.params.toUserId;
        const fromUserId=req.user._id;
        const status=req.params.status;
        const sentReq=new connectionRequest({
            toUserId,
            fromUserId,
            status

        })

        const user=await User.findById(toUserId);
        if(!user){
            throw new Error("user with this id downt exist");
        }

       if(!["ignored","interested"].includes(status)){
          throw new Error("invalid status");
       }
        const alreadyExists = await connectionRequest.findOne({
            $or: [
              { toUserId: toUserId, fromUserId: fromUserId },
              { toUserId: fromUserId, fromUserId: toUserId }
            ]
          });
          
        if(alreadyExists){
            throw new Error("Already exist");
        }
        await sentReq.save();
        res.send("connection request sent succesfully");


    }catch(err){
        res.status(400).send(`Error message: ${err.message}`);
    }
})



requestRouter.post('/request/review/:status/:request_id',auth, async (req,res)=>{
    const loggedInUser=req.user;
     const id=req.params.request_id;
     const status=req.params.status;
     const allowedStatus=["accepted","rejected"];
    
     try{
        if(!allowedStatus.includes(status)){
            throw new Error("status Invalid");
         }

        const connectionReq=await connectionRequest.findOne({
            _id:id,
            toUserId:loggedInUser._id,
            status:"interested"
         })

         if(!connectionReq){
            return res.status(400).json({message:"Connection request not found"});
         }
         connectionReq.status=status;
         const data=await connectionReq.save();
         res.json({message:"Connection request "+status+"successfully",data
    })

     }catch(err){
        res.status(400).send(err.message);
     }
   



})

module.exports=requestRouter;