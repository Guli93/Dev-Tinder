const express = require('express');
const connectDb = require('./config/db');
const cookieParser =require('cookie-parser');
const authentication=require('./routes/authentication');
const profile=require('./routes/profile');
const request=require('./routes/request');
const connections=require('./routes/connections');
const cors=require('cors')

const app = express();
require('dotenv').config()
// console.log(process.env.JWT_TOKEN)

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization", // Include all necessary headers
  })
);



app.use(express.json())
app.use(cookieParser());

app.use('/', authentication);
app.use('/',profile);
app.use('/',request);
app.use('/', connections);

app.get('/user', async (req, res) => {
  const emailId = req.body.email;
  try {
    const user = await User.find({ email: emailId });
    res.send(user);
  } catch (err) {
    res.status(400).send("'something went wrong");
  }

});

app.get("/allusers", async (req, res) => {

  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }

})

app.delete("/delete", async (req, res) => {
  const id = req.body.id;
  // console.log(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.send(deletedUser);
  } catch (err) {
    res.status(400).send("sionething went wrong");
  }


})

app.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const Updates_Allowed = ["name", "skills", "about", "gender"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      Updates_Allowed.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("You can't update this field");
    }


    if (data.skills && data.skills.length > 10) {
      throw new Error("You can't add more than 10 skills");
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      runValidators: true,
      new: true, // Ensures you get the updated document
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    res.send(updatedUser);
  } catch (err) {
    res.status(400).send("UPDATE ERROR: " + err.message);
  }
});




connectDb()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(process.env.PORT, () => {
      console.log("App is listening on port 3000..");
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
  });

