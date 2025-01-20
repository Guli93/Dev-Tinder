const express = require('express');
const { auth } = require('../middlewares/auth');
const connectionRouter = express.Router();
const connectionRequest = require('../model/connectionRequest');
const User =require('../model/user');



connectionRouter.get('/user/request/recieved', auth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const allRequest = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", ["name", "gender","photoUrl","about"]);


        if (allRequest.length === 0) {
            return res.status(200).json({ message: "No connections found", allRequest: [] });
        }

        res.status(200).json({ message: "All the requests", allRequest });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


connectionRouter.get('/user/connections', auth, async (req, res) => {

    try {
        const SAFE_DATA=["name","about","skills","photoUrl"];
        const loggedInUser = req.user._id;
       const allConnections= await connectionRequest.find({
            $or: [
                { toUserId: loggedInUser, status: "accepted" },
                { fromUserId: loggedInUser, status: "accepted"}
            ]
        }).populate("fromUserId",SAFE_DATA).populate("toUserId",SAFE_DATA);
        const data= allConnections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        // res.send(data);
        res.json({message:"all connections",data});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


connectionRouter.get('/feed',auth,async (req,res)=>{
    try{
        const loggedInUser=req.user._id;
        const hideUsers=await connectionRequest.find({$or:
            [{toUserId:loggedInUser}, 
             {fromUserId:loggedInUser},

            ]
        }).select("fromUserId toUserId");

          // Extract user IDs from the hideUsers array
        const hideUserIds = hideUsers.flatMap(({ fromUserId, toUserId }) => 
        [fromUserId.toString(), toUserId.toString()]
      );
  

        const data = await User.find({_id: {$nin: hideUserIds}}).select("name about age photoUrl");
       
        res.json({message:"all the users",data});
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = connectionRouter;