const mongoose = require("mongoose");

const validatorActivity = new mongoose.Schema({

assetname: String,
tokenid: String,
validatorwltaddress: String,
validatorname: String,
validatorusername: String,
ownerusername: String,
ownername: String,
ownerwltaddress: String,
createrusername: String,
creatername: String,
createrwltaddress: String,
userWltAddress: String,
Message: String,
DateAndTime: String,

});

module.exports = mongoose.model("validatorActivity", validatorActivity);
