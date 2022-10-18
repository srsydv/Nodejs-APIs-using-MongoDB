const asyncHandler = require("../middleware/async");
const userModel = require("../models/User-profile");
const validatorModel = require("../models/Validator-profile");
const moment = require('moment');
const jwt = require('jsonwebtoken')
const validatorHelperfn = require("../middleware/validator-helper")
const userHelperfn = require("../middleware/user-helper")

const userLogin = async (clm) => {
    try {
        return new Promise(async (resolve, reject) => {
            let data = await userModel.find({ address: clm.address });
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



const validatorLogin = async (clm) => {
    try {
        return new Promise(async (resolve, reject) => {
            const data = await validatorModel.find({ address: clm.address });
            if (data) {
                resolve(data[0]);
            } else {
                reject("Error");
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: "Failed to execute for Validator check",
        });
    }
}


const insertAdd = async (clm) => {
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
            message: "Failed to insert User Address",
        });
    }
}


exports.Authlogin = async function (req, res) {
    try {
        const clm = {
            address: (req.body.address).toLowerCase()
        }
        const authuser1 = {
            address: (req.body.address).toLowerCase(),
            hostname: "",
            ip: "",
            lastRequestAt: req.session._lastRequestAt
        };
        const validatordata = await validatorLogin(clm);
        if (validatordata) {
            res.send(
                {
                    message: "Validator"
                }
            );
        }
        else {
            const data1 = await userLogin(clm);
            if (!data1[0]) {
                const insAdd = await insertAdd(authuser1);
            }
            const data = await userLogin(clm);
            const access_token = jwt.sign({
                address: data[0].address
            },
                process.env.JWT_SECRET, {
                expiresIn: "5d"
            });

            let useralldata = data[0];
            data[0].password = "NahiBataunga";

            res.send({
                message: 'Authorized User',
                accessToken: access_token,
                user: useralldata
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: "Failed to execute User Login",
        });
    }

};


exports.validatorlogin = async function (req, res) {
    try {
        const clm = {
            address: (req.body.address).toLowerCase()
        }
        const authuser1 = {
            address: (req.body.address).toLowerCase(),
            hostname: "",
            ip: "",
            lastRequestAt: req.session._lastRequestAt
        };
        const data1 = await validatorHelperfn.loginValidator(clm);
        if (data1.length == 0) {
            const insAdd = await validatorHelperfn.insertAdd(authuser1);
        }
        const data = await validatorHelperfn.loginValidator(clm);
        const access_token = jwt.sign({
            address: data[0].address
        },
            process.env.JWT_SECRET, {
            expiresIn: "5d"
        });

        let useralldata = data[0];
        data[0].password = "NahiBataunga";

        res.send({
            message: 'Authorized User',
            accessToken: access_token,
            user: useralldata
        })

    } catch (error) {
        console.log("eee", error)
        res.status(400).json({
            success: false,
            data: error,
            message: "Failed to execute validator Login",
        });
    }
};

