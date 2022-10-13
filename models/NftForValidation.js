const mongoose = require("mongoose");

const NftForValidation = mongoose.Schema({
  assetname: String,
  tokenid: String,
  ownerusername: String,
  ownername: String,
  ownerwltaddress: String,
  createrusername: String,
  creatername: String,
  createrwltaddress: String,
  address: String,
  validationstate: {
    type: String,
    enum: ["not started", "pending", "validated"],
    default: "not started",
  },
  validatorname: String,
  validatorusername: String,
  validatorwltaddress: String,
  city: String,
  homeaddress: String,
  estimatedvalue: String,
  validatornameforvld: String,
  validatorusernameforvld: String,
  validatorwltaddressforvld: String,
  nftimage: String,
  nftimage1: String,
  nftimage2: String,
  nftimage3: String,
  sendforvalidationdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NftForValidation", NftForValidation);