const express=require('express');
const bcrypt = require('bcrypt');
const { validatSignupData } = require('../utils/validation');
const authenticationRouter=express.Router();
const jwt=require("jsonwebtoken");
const User = require('../model/user');

//SIGNUP API
authenticationRouter.post("/signup", async (req, res) => {
  try {
      validatSignupData(req.body);
      const passHash = await bcrypt.hash(req.body.password, 10);
      const { name, email, password, gender, about, skills, photoUrl } = req.body;
      const user = new User({
          name,
          email,
          password: passHash,
          gender,
          about,
          skills,
          photoUrl
      });
      
     const saveUser= await user.save();
     const token = await saveUser.getJWT();

     res.cookie("token", token, { httpOnly: true, sameSite: "Strict" },{expires:"7d"});
      res.send("User successfully registered.");
  } catch (err) {
      if (err.code === 11000) {
          // Handling duplicate email error
          res.status(400).send("Email already exist");
      } else {
          res.status(400).send(`${err.message}`);
      }
  }
});


  // LOGIN API
  authenticationRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
  
      if (!user) {
        throw new Error("Email is not present");
      } else {
        // const isPassValid = await bcrypt.compare(password, user.password);
        const isPassValid=await user.validatePassword(password);
        if (isPassValid) {
          // Use user._id for the token payload
          // const token = await jwt.sign({ _id: user._id }, "DevTinder@@@123",{expiresIn:'1d'});
          const token=await user.getJWT();
          console.log("Generated Token:", token);
  
          // Set the cookie with the token
          res.cookie("token", token, { httpOnly: true, sameSite: "Strict" },{expires:"7d"});
          res.send(user);
        } else {
          throw new Error("Password is incorrect");
        }
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  authenticationRouter.get('/logout',async (req,res)=>{
     res.cookie("token",null,{expires: new Date(Date.now())});
    res.send("logout succefully");
  })


  module.exports=authenticationRouter;
  
  

  
  
  