const mongoose = require("mongoose");
const createHash = require("../utils.js")

const userCollection = "users";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    age: Number,
    password: String,
    rol: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" }
});

userSchema.pre('save', (next) => {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = createHash(this.password);
    next();
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel