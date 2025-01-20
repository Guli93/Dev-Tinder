const express=require('express');
const profileRouter=express.Router();
const { auth } = require('../middlewares/auth');
const { validateProfileUpdate} =require('../utils/validation');
const User=require('../model/user');


profileRouter.get('/profile/view',auth,async(req,res)=>{
 
    try{
      const loggedInUser=req.user;
      const {name}=loggedInUser;
    res.status(200).send(loggedInUser);
  }catch(err){
    res.status(400).send(`Error: ${err.message}`);
  }
  
  });

  profileRouter.patch('/profile/update',auth,async (req,res)=>{
    try{
      const loggendInUser=req.user;
      validateProfileUpdate(req.body);
      Object.keys(req.body).forEach((key)=>(loggendInUser[key]=req.body[key]));
      await loggendInUser.save();
      res.send("updated succesfully");

    }catch(err){
      res.status(404).send(err.message);
    }
  })

  module.exports=profileRouter;