const socket=require('socket.io');
const Chats = require('../model/chats');
const connectionRequest = require('../model/connectionRequest');
;

const initializeSocket=(server)=>{
 const io=socket(server,{
    cors:{
        origin: "http://localhost:5173",
    },
 })

 io.on("connection", (socket)=>{

    socket.on("joinChat",async({targetUserId, loggedInUserId})=>{

      // const findConnection=await connectionRequest.findOne({
      //   $or:[
      //     {fromUserId:loggedInUserId,toUserId:targetUserId,status:"accepted"},
      //     {fromUserId:targetUserId,toUserId:loggedInUserId,status:"accepted"}]
      // }
      // );

      // if (!findConnection) {
      //   socket.emit("error", "This user is not in your connection");
      //   return;
      // }
      const roomId=[targetUserId,loggedInUserId].sort().join("_");
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);

    });

    socket.on("sendMessage",async({name,loggedInUserId,targetUserId,text,replyTo,time})=>{

      try{
        const roomId=[targetUserId,loggedInUserId].sort().join("_");
        
        let chat= await Chats.findOne( {participants:{$all:[loggedInUserId,targetUserId]}})
        if(!chat){
          chat= await new Chats({
            participants:[loggedInUserId,targetUserId],
            messages:[]
          })

          
        }
        chat.messages.push({
          userId:loggedInUserId,
          text:text,
          replyTo:replyTo,
          time:time,

        })
        
      // console.log("Message ID after push:", chat.messages[chat.messages.length - 1]._id);
      

        const savedMessages=await chat.save();
       
      io.to(roomId).emit("messageRecieved",{name,text,replyTo,time, msgId:savedMessages._id});
       // console.log(name +" has sent "+msg)
      }catch(err){
        console.log(err);
      }
     
     
    });

    socket.on("deleteMessage", async({targetUserId,loggedInUserId,messageId})=>{
      try{
        const roomId=[targetUserId,loggedInUserId].sort().join("_");
        const chat=await Chats.findOne({participants:{$all:[targetUserId,loggedInUserId]}});

        console.log("Message ID to delete:", messageId);
        console.log("Existing message IDs:", chat.messages.map(msg => msg._id.toString()));
      if(chat){
        const messageIndex=chat.messages.findIndex(msg=>msg._id.toString()===messageId);
        console.log(messageIndex);
        if(messageIndex!==-1){
          chat.messages.splice(messageIndex,1);
          await chat.save();
          io.to(roomId).emit("messageDeleted",{messageId});
        }else{
          socket.emit("error", { message: "Message not found" });
        }
      }else{
        socket.emit("error",{message:"message not found"});
      }
      }catch(err){
        console.log("error in delete");
      }
      
      
    })
 })
}

module.exports=initializeSocket;


