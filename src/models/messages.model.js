const mongoose = require("mongoose");

const messageCollection = "message";

const messageSchema = new mongoose.Schema({
    user: { type: String, max: 20, required: true },
    message: { type: String, max: 100, required: true }
})

const messageModel = mongoose.model(messageCollection, messageSchema)

module.exports = { messageModel }