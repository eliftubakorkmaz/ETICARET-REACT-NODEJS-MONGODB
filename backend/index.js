const mongoose = require("mongoose");
const express = require("express");
const app = express();
const {v4:uuidv4} = require("uuid");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://etubas:1234@testdb.u85b4ow.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri).then(res => {
    console.log("Database bağlantısı başarılı")
}).catch(err => {
    console.log(err.message);
});

//User Collection
const userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

//Product Collection
const prdouctSchema = new mongoose.Schema({
    _id: String,
    name: String,
    stock: Number,
    price: Number,
    imageUrl: String
});

const Product = mongoose.model("Product", prdouctSchema);

//Basket Collection
const basketSchema = new mongoose.Schema({
    _id: String,
    productid: String,
    userid: String,
    count: Number,
    price: Number
});

const Basket = mongoose.model("Basket", basketSchema);

//Order Collection
const orderSchema = new mongoose.Schema({
    _id: String,
    productid: String,
    userid: String,
    count: Number,
    price: Number
});

const Order = mongoose.model("Order", orderSchema);

//Token
const secretKey = "Gizli anahtarım Gizli anahtarım Gizli anahtarım" 
const option = {
    expiresIn : "1h"
}

//Register işlemleri
app.post("/auth/register", async (req,res) => {
    try {
        const {name, email, password} = req.body;
        let user = new User({
            _id: uuidv4(),
            name: name,
            email: email,
            password: password
        });

        await user.save();
        const payload = {
            user: user
        }
        const token = jwt.sign(payload, secretKey, options);
        res.json({user: user, token: token})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

//Login methodu
app.post("auth/login", async (req,res) => {
    try {
        const {email, password} = req.body;
        const users = await User.find({email: email, password: password});
        if (users.lengt == 0){
            res.status(500).json({message: "Mail adresi yada şifre yanlış"});
        } else {
            const payload = {
                user: users[0]
            }
            const token = jwt.sign(payload, secretKey, options);
            res.json({user: users[0], token: token})
        }
    }catch (error) {
        res.status(500).json({error: error.message})
    }
})

const port = 5000;
app.listen(5000, () => {
    console.log("Uygulama http://localhost:" + port + " üzerinden ayakta !");
})