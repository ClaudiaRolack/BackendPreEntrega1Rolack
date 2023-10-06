const mongoose = require("mongoose");

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    title: { type: String, max: 20, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true }
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema)

module.exports = { cartsModel }