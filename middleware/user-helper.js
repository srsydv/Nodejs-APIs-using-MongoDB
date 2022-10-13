const userModel = require("../models/User-profile");
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


module.exports = {
    findName,
    userDetail
}
