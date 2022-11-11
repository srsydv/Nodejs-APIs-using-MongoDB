const mongoose = require("mongoose");

const UserProfile = new mongoose.Schema({
  username: String,
  name:String,
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

module.exports = mongoose.model("UserProfile", UserProfile);
