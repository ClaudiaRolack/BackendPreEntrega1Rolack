const mongoose = require("mongoose");

const userCollection = "users";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    age: Number,
    password: String,
    rol: String
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel