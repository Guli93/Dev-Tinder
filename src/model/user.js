const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema=new mongoose.Schema({
   name:{
      type:String,
      required:true,
      min:5,
   },
   email:{
      type: String,
      unique:true,
      index:true,
      lowercase:true,
      trim:true,
      required:true,
   },
   password:{
       type:String,
       required:true
   },
   gender:{
      type:String,
      validate(value){
         if(!["male","female","other"].includes(value)){
            throw new Error("Enter valid Gender");
         }
      }
      
   },
   age:{
      type:Number
   },
   photoUrl:{
      type:String,
      default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
   },
   skills:{
      type:[String]
   },
 
   about:{
      type:String,
      default:"This is default about"
   }
},  { timestamps: true }
)

userSchema.methods.getJWT= async function(){
   const user=this;
   const token = await jwt.sign({ _id: user._id }, process.env.JWT_TOKEN ,{expiresIn:'1d'});

   return token;
   
}
userSchema.methods.validatePassword=async function(passwordInputByUser){
   const user=this;
   const isPasswordValid= await bcrypt.compare(passwordInputByUser, user.password);
   return isPasswordValid;
}
module.exports = mongoose.model("User",userSchema);