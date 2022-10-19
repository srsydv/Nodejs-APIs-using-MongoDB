const userModel = require("../models/User-profile");
const NFTmodel = require("../models/Nftprofiledetail")
const userActivity = require("../models/user-activity")
const moment = require('moment');

findName = async (address) => {
    return new Promise(async (resolve, reject) => {
        let data = await userModel.find({ address: address });
        if (data) {
            resolve(data);
        } else {
            reject("Error");
        }
    })
}

userDetail = async (address) => {
    return new Promise(async (resolve, reject) => {
        let data = await userModel.find({ address: address });
        if (data) {
            resolve(data);
        } else {
            reject("Error");
        }
    })
}

NFTdetails = async (tokenid) => {
    return new Promise(async (resolve, reject) => {
        let data = await NFTmodel.find({ tokenid: tokenid });
        if (data) {
            resolve(data);
        } else {
            reject("Error");
        }
    })
}

bidDetail = async (clm) => {
    try {
        return new Promise(async (resolve, reject) => {
            let data = await userActivity.find({ bidid: clm.bidid, message: clm.message });
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
            message: "Not able to get bid",
        });
    }
}

module.exports = {
    findName,
    userDetail,
    NFTdetails,
    bidDetail
}
