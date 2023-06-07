require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/userDB');
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;    // level 2
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });   // Level 2

const User = new mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render("home")
});
app.get('/login', (req, res) => {
    res.render("login")
});
app.get('/register', (req, res) => {
    res.render("register")
});

app.post("/register", (req, res) => {
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });
    user.save();
    res.render("secrets");
});
app.post("/login", (req, res) => {
    User.findOne({email: req.body.username}).then((data) => {
        if (data.password === req.body.password) {
            res.render("secrets");
        } else {
            res.send("Wrong email or password!")
        }
    })
});

app.listen(3000, function () {
    console.log("Server is running on port 3000 --");
});