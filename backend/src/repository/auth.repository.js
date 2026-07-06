import user from "../models/user.js";
import db from "../models/index.js";
import { Op } from "sequelize"
const User = db.user;

const createUser = async(data)=>{
    return await User.create(data)
}

const findByEmailOrUsername = async(data)=>{

    const {username,email} = data

    return await User.findOne({
        where: {
            [Op.or]: [{ username }, { email }]
        }
    });
}

const findByIdentifier = async(identifier)=>{

    return await User.findOne({
        where:{
            [Op.or]:[{email:identifier},{username:identifier}]
        }
    });
}

const findUserByPk = async(userId)=>{

    return await User.findByPk(userId, {
        attributes: ["id","username", "fullName", "email","avatar"]
    })
}
const findByPkWithAllFields = async(userId)=>{

    return await User.findByPk(userId)
}

const updateUser = async(user,data)=>{
    return await user.update(data)
}

export {
    createUser,
    findByIdentifier,
    findByPkWithAllFields,
    findByEmailOrUsername,
    findUserByPk,
    updateUser
}