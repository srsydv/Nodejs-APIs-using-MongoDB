const userModel = require("../models/User-profile");
const NFTmodel = require("../models/Nftprofiledetail")
const moment = require('moment');

findName = async (address) => {
    return new Promise(async(resolve, reject) => {
        let data = await userModel.find({address:address});
        if (data) {
            resolve(data);
        } else {
            reject("Error");
        }
    })
}

userDetail = async (address) => {
    return new Promise(async(resolve, reject) => {
        let data = await userModel.find({address:address});
        if (data) {
            resolve(data);
        } else {
            reject("Error");
        }
    })
}

NFTdetails = async (tokenid) => {
    return new Promise(async(resolve, reject) => {
        let data = await NFTmodel.find({tokenid:tokenid});
        if (data) {
            resolve(data);
        } else {
            reject("Error");
        }
    })
}

module.exports = {
    findName,
    userDetail,
    NFTdetails
}
