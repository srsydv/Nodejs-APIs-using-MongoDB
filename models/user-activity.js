const mongoose = require("mongoose");

const userActivity = new mongoose.Schema({
  
assetname: String,
tokenid: String,
toswapassetname: String,
toswaptokenid: String,
swaprequesttouserwltAddress: String,
swaprequesttoname: String,
swaprequesttousername: String,
username: String,
name: String,
userwltaddress: String,
message: String,
validatorwltaddress: String,
validatorname: String,
validatorusername: String,
nfttransferaddress: String,
nfttransferusername: String,
nfttransfername: String,
DateAndTime: String,
buyamount: String,
makeofferamount: String,
biddingamount: String,
bidid: Number,
bidstatus: String,
swapid: Number,
swapstatus: String,
bidderaddress: String,
whomadeoffer: String,
markasread: {
    type: String,
    enum: ["read", "unread"],
    default: "unread",
  },

},{ timestamps: true });

module.exports = mongoose.model("userActivity", userActivity);
