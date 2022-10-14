const asyncHandler = require("../middleware/async");
const UserModel = require("../models/User-profile");
const validatorModel = require("../models/Validator-profile");
const validatorActivity = require("../models/validator-activity")
const userActivity = require("../models/user-activity")
const NFTforValidationModel = require("../models/NftForValidation");
const NFTprofileDetailModel = require("../models/Nftprofiledetail");
const userHelper = require("../middleware/user-helper")
const validatorHelper = require("../middleware/validator-helper")
const jwt = require('jsonwebtoken')
const moment = require('moment');

exports.listNFTforMP = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    await NFTprofileDetailModel.updateMany(
      { tokenid: req.body.tokenid, assetname: req.body.assetname, ownerwltaddress: user.address },
      {
        $set:
        {
          onselldate: moment().format(),
          sellstatus: "pending",
          mptype: req.body.mptype,
          mpprice: req.body.mpprice,
          mpduration: req.body.mpduration,
          mpsupply: req.body.mpsupply,
          mpsetasbundle: req.body.mpsetasbundle,
          mpreserveforspecificbuyer: req.body.mpreserveforspecificbuyer,
          mpfees: req.body.mpfees
        }
      }
    )

    res.send({ result: "Listed" })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
}


exports.MarketPlaceNFTs = async (req, res) => {

}