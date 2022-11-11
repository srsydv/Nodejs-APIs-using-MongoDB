const mongoose = require("mongoose");

const ValidatorProfile = new mongoose.Schema({
  name:String,
  username: String,
  address: String,
  bio: String,
  profilepic: String,
  profilebanner: String,
  homeaddress: String,
  city: String,
  email: String,
  phone: String,
  twitter: String,
  facebook: String,
  instagram: String,
  websiteurl: String,
  favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: "NftProfileDetail" }],
});

module.exports = mongoose.model("ValidatorProfile", ValidatorProfile);
