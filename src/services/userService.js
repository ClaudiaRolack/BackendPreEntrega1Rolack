const fs = require("fs").promises;
const getNextId = require("../helpers/getNextId");
const userModel = require("../models/user.model.js");
const cartsModel = require("../models/carts.model.js");
const { createHash } = require("../utils");


class UserManager extends userModel {

    constructor() {
        super();
    };

    async addUser(userData) {
        const { firstName, lastName, email, age, password } = userData;

        const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: createHash(password)
        };

        try {
            const result = await userModel.create(newUser);
            return result;
        } catch (error) {
            throw error;
        }
    }

    updateUser = async (id, userData) => {
        try {
            const user = await UserManager.findById(id);
            if (!user) {
                return "Usuario no encontrado";
            }
            user.set(userData)
            await user.save();
            return "Usuario actualizado";
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            return "Error al actualizar el usuario";
        };
    };

    getUsers = async () => {
        try {
            const users = await UserManager.find({});
            return users;
        } catch (error) {
            console.log("Usuarios no encontrados:", error);
            return "Usuarios no encontrados";
        };
    };

    getUserById = async (id) => {
        try {
            const user = await UserManager.findById(id).lean();
            if (!user) {
                return "Usuario no encontrado";
            }
            return user;
        } catch (error) {
            console.log("Error al obtener el usuario:", error);
            return "Error al obtener el usuario";
        };
    };

    validateUser = async (param) => {
        try {
            const user = await UserManager.findOne({ email: param });
            if (!user) { return "Usuario no encontrado" }
            return user;
        } catch (error) {
            console.error("Error al validar usuario:", error)
            return "Error al validar usuario";
        };
    };

    deleteUSer = async (id) => {
        try {
            const user = await UserManager.findById(id);
            if (!user) {
                return "Usuario no encontrado";
            }
            await user.remove();
            return "Usuario eliminado";
        } catch (error) {
            console.log("Error al eliminar el usuario:", error);
            return "Error al eliminar el usuario";
        }
    };
};

module.exports = { UserManager }