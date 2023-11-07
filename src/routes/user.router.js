const express = require("express");
const { Router } = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserManager } = require("../services/userService");
const { passportCall } = require("../utils.js");
const { authorization } = require("../utils.js")

const router = Router();
const userManager = new UserManager();

router.get("/login", async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.json({ status: "Logout error", body: error });
        }
        res.redirect("../../login")
    });
});

router.post("/register", passport.authenticate('register'), (req, res) => {
    try {
        let newUser = req.body
        userManager.addUser(newUser)
        res.redirect("/login")
    } catch (error) {
        console.log("Error de resgistro:", error);
        res.redirect("/failregister");
        return "Error de resgistro";
    }
});

router.get("/failregister", async (req, res) => {
    console.log("Falla de registro");
    res.send({ error: "Falló" })
});

router.post("/login", passport.authenticate('login'), async (req, res) => {

    try {
        let email = req.body.email;
        const data = await userManager.validateUser(email);
        const password = data.password
        const rol = data.rol

        const token = jwt.sign({ email, password, rol }, "Secret-key", { expiresIn: "24h" });
        res.cookie("token", token, { maxAge: 60 * 60 * 1000, httpOnly: true });

        if (data && (await bcrypt.compare(req.body.password, data.password))) {
            if (data.rol === "admin") {
                req.session.emailUsuario = email;
                req.session.nombreUsuario = data.firstName;
                req.session.apellidoUsuario = data.lastName;
                req.session.rolUsuario = data.rol;
                res.redirect("/profile");
            } else {
                req.session.emailUsuario = email;
                req.session.rolUsuario = data.rol;
                req.session.cartId = data.cart;
                res.redirect("/products");
            }
        } else {
            res.redirect("../../login");
        }

    } catch (error) {
        console.error("Error al acceder al perfil:", error);
        return "Error al acceder al perfil";
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy((error) => {
        if (error) { return res.json({ status: "Logout error", body: error }) }
        res.redirect("../../login")
    });
});

router.get("/github", passport.authenticate("github", { scope: [ "user:mail" ] } ), async (req, res) => {})

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user= req.user
    req.session.emailUsuario = req.session.user.email
    req.session.rolUsuario = req.session.user.rol
    res.redirect("/products")
});

router.get("/current", passportCall("jwt"), authorization("user"), (req, res) => {
    res.send(req.user)
});


module.exports = router