const mongoose = require('mongoose');
const express = require('express');
let Animals = require('./models/animals.js');
const cors = require("cors");

mongoose.connect("mongodb+srv://onclickmagic:onClickMongo@onclickmagic.8blvh8a.mongodb.net/")

const app = express();
app.use(express.json());
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get("/dognames", (req, res) => {
    const data = readDataFile("./server/names.json");
    res.send(data.dogs);
})

app.get("/catnames", (req, res) => {
    const data = readDataFile("./server/names.json");
    res.send(data.cats);
})





app.listen(4000, () => console.log('Server started on port 4000'));