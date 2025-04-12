const express = require('express');
const connectDb = require('./config/db');
const cookieParser =require('cookie-parser');
const authentication=require('./routes/authentication');
const profile=require('./routes/profile');
const request=require('./routes/request');
const connections=require('./routes/connections');
const cors=require('cors')
const http =require('http');
const initializeSocket = require('./utils/websocket');
const chat = require('./routes/chat');


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
app.use('/',chat);


const server=http.createServer(app);
initializeSocket(server);


connectDb()
  .then(() => {
    console.log("DB connected successfully");
    server.listen(process.env.PORT, () => {
      console.log("App is listening on port 3000..");
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
  });

