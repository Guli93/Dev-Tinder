const express = require("express");

const app = express();

app.get('/', (req, res) => {
    res.send("Hi, I am the server");
});

app.get('/home', (req, res) => {
    res.send("I am the Home page");
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000...");
});

app.use('/hello',(req,res,next)=>{

  console.log("hello")
  next();
  res.send("print hello");

},(req,res,next)=>{
    console.log("hello2");
    res.send("print hello2");
    next();

},(req,res)=>{
    console.log("hello3");
    res.send("hello3")
})


const { auth } = require('./middlewares/auth')
app.use('/admin',auth);

app.get('/admin/getAllData',(req,res)=>{
    res.send("All the Data");
})