const fs = require("fs").promises;
const getNextId = require("../helpers/getNextId");
const userModel = require("../models/user.model.js")
const cartsModel = require("../models/carts.model.js")

class UserManager extends userModel {

    constructor() {
        super();
    };

    addUser = async (userData) => {
        try {
            const newUser = await userModel.create(userData);
            const newCart = await cartsModel.create({ products: [] })
            newUser.cart = newCart._id
            
            await newUser.save()
            return "Usuario agregado";
        } catch (error) {
            console.error("Error al agregar el usuario:", error);
            return "Error al agregar el usuario";
        };
    };

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