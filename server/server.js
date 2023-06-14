const mongoose = require('mongoose');
const express = require('express');
let Animal = require('./models/animal.js');
const cors = require("cors");
const fs = require("fs");

mongoose.connect("mongodb+srv://onclickmagic:onClickMongo@onclickmagic.8blvh8a.mongodb.net/")

const app = express();
app.use(express.json());
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
    next();
})

function readDataFile(file) {
    const content = fs.readFileSync(file, "utf8");
    const data = JSON.parse(content);
    return data;
}

app.get("/dognames", (req, res) => {
    const data = readDataFile("./names.json");
    res.send(data.dogs);
})

app.get("/catnames", (req, res) => {
    const data = readDataFile("./names.json");
    res.send(data.cats);
})

// app.get("/animal/:id", (req, res) => {
//     const searchId = req.params.id;
//     Animal.find({id:searchId})
//     .then((data) => res.json(data))
//     .catch(error => res.json(error))
// })

app.get("/animal", (req,res) => {
    Animal.find({})
    .then(data => res.json(data))
    .catch(error => res.json(error))
});

app.post ("/animal", (req,res) => {
    // console.log(req.body);
    const id = req.body.id;
    const title = req.body.title;
    const comment = req.body.comment;
    const breed = req.body.breed;
    const favourite = req.body.favourite;
    const votes = req.body.votes;
    const createdAt = Date.now();
    const imgUrl = req.body.imgUrl;
    const type = req.body.type;

    Animal.find({id:id})
    .then(data => {
        if (data.length===0){
            console.log("save");
            const animal = new Animal({
                id,
                title,
                comment,
                breed,
                favourite,
                votes,
                createdAt,
                imgUrl,
                type
              });
              animal.save()
                .then(() => res.json(`${type} saved to Database`))
                .catch(err => res.status(400).json({ success: false }));
        }else {
            const animal = data[0];          
            animal.title = title;
            animal.comment = comment;
            animal.votes = votes;
            animal.save()
            .then(() => res.send(JSON.stringify("Animal updated")))
            .catch(error => {
                console.error(error);
            });
        }
    })
})

app.get('/animal', (req, res) => {
    Animal.find()
        .then(animal => {
        console.log("animal", animal)
        res.json(animal);
        })
        .catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
        });
    });

app.delete('/animal/:id', (req, res) => {
    const id = req.params.id;

    Animal.findByIdAndDelete(id)
    .then(() => {
        console.log('Todo deleted:', id);
        res.sendStatus(204);
    })
    .catch(error => {
        console.error('Error deleting todo:', error);
        res.status(500).send('Internal Server Error');
    });
})

app.listen(4000, () => console.log('Server started on port 4000'));