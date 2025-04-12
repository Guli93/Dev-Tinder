const mongoose=require('mongoose');
const User=require('./user');

const msgSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    },
    replyTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Chats.messages",
        default:null
    },
    time:{
        type:Date
    }
},{timestamps:true})

const chatSchema= new mongoose.Schema({
    
    participants:[
        {type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
        }
    ],
    messages:[
        msgSchema
    ]
},{timestamps:true})

module.exports= mongoose.model("Chats",chatSchema)