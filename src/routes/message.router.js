const { Router } = require("express");
const { messageModel } = require("../models/messages.model");
const router = Router();

router.get("/", async (req, res) => {
    try {
        let message = await messageModel.find();
        res.send({ result: "success", payload: message });
    } catch (error) {
        console.log(error);
    };
});

router.post("/", async (req, res) => {
    let { user, message } = req.body;

    if (!user || !message) {
        res.send({ status: "error", error: "El mensaje no se pudo enviar" });
    } else {
        let result = await messageModel.create({ user, message });
        res.send({ result: "success", payload: result });
    }
});

router.put("/:mid", async (req, res) => {
    let { mid } = req.params;
    let messageToReplace = req.body;

    if (!messageToReplace.user || !messageToReplace.message) {
        res.send({ status: "error", error: "No hay datos en parametros" });
    } else {
        let result = await messageModel.updateOne({ _id: mid }, messageToReplace);
        res.send({ result: "success", payload: result });
    };
});

router.delete("/:mid", async (req, res) => {
    let { mid } = req.params;
    let result = await messageModel.deleteOne({ _id: mid });
    res.send({ result: "success", payload: result });
});

module.exports = router