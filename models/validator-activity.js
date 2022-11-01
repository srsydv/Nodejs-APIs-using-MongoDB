const mongoose = require("mongoose");

const validatorActivity = new mongoose.Schema(
  {
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
    message: String,
    DateAndTime: String,
    buyamount: String,
    markasread: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("validatorActivity", validatorActivity);
