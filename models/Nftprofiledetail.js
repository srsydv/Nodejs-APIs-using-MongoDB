const mongoose = require("mongoose");

const NftProfileDetail = new mongoose.Schema({
  assetname: String,
  typeofart: String,
  dimension: String,
  bio: String,
  createrusername: String,
  creatername: String,
  createrwltaddress: String,
  ownerusername: String,
  ownername: String,
  ownerwltaddress: String,
  city: String,
  tokenid: String,
  dateofcreation: String,
  marking: String,
  provenance: String,
  estimatedvalue: Number,
  evidenceofownership: String,
  nftimage: String,
  nftimage1: String,
  nftimage2: String,
  nftimage3: String,
  blockchain: String,
  validationstate: {
    type: String,
    enum: ["not started", "pending", "validated"],
    default: "not started",
  }, //3 options
  validatorname: String,
  validatorusername: String,
  validatorwltaddress: String,
  validateAmount: String,
  nftcreationdate: String,
  burnNFTstatus: String,
  swapStatus: String,
  sellstatus: {
    type: String,
    enum: ["not started", "pending", "sold"],
    default: "not started",
  },
  ipfsmetadataurl: String,
  mptype: String,
  mpprice: String,
  mpduration: String,
  mpsupply: String,
  mpsetasbundle: String,
  mpreserveforsp: String,
  mpfees: String,
  mpstartingprice: String,
  mpendingprice: String,
  buyamount: String,
  redeemNFTstatus: String,
  listonmarketplace: String,
  redeemNFTrequest: {
    type: String,
    enum: ["false", "true", "accepted", "redeemed"],
    default: "false",
  },
},{ timestamps: true });

module.exports = mongoose.model("NftProfileDetail", NftProfileDetail);
