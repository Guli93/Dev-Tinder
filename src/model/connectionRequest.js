const mongoose=require('mongoose');
const User=require('./user');

const connectionRequestSchema= new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",

    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["accepted","rejected","interested","ignored"],
            message:'{VALUE} is not supported'

        }
    }
},
    {timestamps:true}
)

connectionRequestSchema.pre('save',function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("you cant sent request to yourself")
    }
    next();
})

connectionRequestSchema.index({fromUserId:1});
module.exports=mongoose.model("ConnectionRequest",connectionRequestSchema);