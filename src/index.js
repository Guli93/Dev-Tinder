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
