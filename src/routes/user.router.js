const express = require("express");
const { Router } = require("express");
const { UserManager } = require("../services/userService");

const router = Router();
const userManager = new UserManager();

router.get("/login", async(req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.json({ status: "Logout error", body: error });
        }
        res.redirect("../../login")
    });
});

router.post("/register", (req, res) => {
    try {
        let newUser = req.body
        userManager.addUser(newUser)
        res.redirect("/login")
    } catch (error) {
        console.log("Error de resgistro:", error);
        return "Error de resgistro";
    }
});

router.post("/login", async (req, res) => {
    try {
        let email = req.body.email
        const data = await userManager.validateUser(email)
        if (data.password === req.body.password)
        {
            if (data.rol === "admin") {
                req.session.emailUsuario = email
                req.session.nombreUsuario = data.firstName
                req.session.apellidoUsuario = data.lastName
                req.session.rolUsuario = data.rol
                res.redirect("/profile")
            } else {
                req.session.emailUsuario = email
                req.session.rolUsuario = data.rol
                req.session.cartId = data.cart
                console.log(data.cart)
                res.redirect("/products")
            }
        } else {
            res.redirect("../../login")
        }
    } catch (error) {
        console.error("Error al acceder al perfil:", error);
        return "Error al acceder al perfil";
    };
});

module.exports = router