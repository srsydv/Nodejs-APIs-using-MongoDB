const validatorModel = require("../models/Validator-profile");
const userModel = require("../models/User-profile")
const moment = require('moment');

const loginValidator = async (clm) => {
    try {
        return new Promise(async (resolve, reject) => {
            let data = await validatorModel.find({ address: clm.address });
            if (data) {
                resolve(data);
            } else {
                reject("Error");
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: "Failed to execute for User check",
        });
    }
}


const insertAdd = async (clm) => {
    try {
        return new Promise(async (resolve, reject) => {
            let newUserData = new validatorModel({
                address: (clm.address).toLowerCase(),
                hostname: clm.hostname,
                ip: clm.ip,
                astRequestAt: clm.astRequestAt,
                lastLogin: moment().format()
            })
            await newUserData.save();
            resolve("done");
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: "Failed to insert User Address",
        });
    }
}

loginAsUser = async (clm) => {
    try {
        return new Promise(async (resolve, reject) => {
            let data = await userModel.find({ address: (clm.address).toLowerCase() });
            if (data) {
                resolve(data);
            } else {
                reject("Error");
            }
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: "Failed to get User Address",
        });
    }
}


const insertAddAsUser = async (clm) => {
    try {
        return new Promise(async (resolve, reject) => {
            let newUserData = new userModel({
                address: (clm.address).toLowerCase(),
                hostname: clm.hostname,
                ip: clm.ip,
                astRequestAt: clm.astRequestAt,
                lastLogin: moment().format()
            })
            await newUserData.save();
            resolve("done");
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: "Validator Failed to insert User Address",
        });
    }
}

const validatorDetail = async (validatorwltaddress) => {
    try {
        return new Promise(async (resolve, reject) => {
            let data = await validatorModel.find({ address: (validatorwltaddress).toLowerCase() });
            if (data) {
                resolve(data);
            } else {
                reject("Error");
            }
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: "Validator detail Failed",
        });
    }
}


module.exports = {
    loginValidator,
    insertAdd,
    loginAsUser,
    insertAddAsUser,
    validatorDetail
}