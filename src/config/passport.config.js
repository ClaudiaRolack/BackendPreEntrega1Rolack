const passport = require("passport");
const local = require("passport-local");
const jwt = require("passport-jwt");
const GitHubStrategy = require("passport-github2");
const userModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils.js")

const localStrategy = local.Strategy;
const jwtStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = (passport) => {
    passport.use("/register", new localStrategy(
        { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
            const { firstName, lastName, email, age, rol } = req.body

            try {
                let user = await userModel.findOne({ email: username })
                if (user) {
                    console.log("El usuario ya existe")
                    return done(null, false)
                }
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    age,
                    password,
                    rol
                }
                let result = await userModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error al obtener el usuario" + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });

    passport.use("login", new localStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                console.log("El usuario no existe")
                return done(null, false)
            }
            if (!isValidPassword(user, password)) {
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.302edfb19eadda3a",
        clientSecret: "3fedff2210fae4eaec8508df9995d3d9b61af4cd",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.login,
                    last_name: "",
                    age: 20,
                    email: profile._json.email,
                    password: "",
                    rol: "usuario"
                }

                let result = await userModel.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies["token"]
        }
        return token
    }

    passport.use("jwt", new jwtStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "Secret-key",
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error)
        }
    }))
};

module.exports = { initializePassport, ExtractJWT }