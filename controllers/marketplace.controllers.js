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
          mpfees: req.body.mpfees,
          mpstartingprice: req.body.mpstartingprice,
          mpendingprice: req.body.mpendingprice,
          saleid: req.body.saleid,
          listonmarketplace: "true"
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

exports.unlistNFTforMP = async (req, res) => {
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
          sellstatus: "not started",
          mptype: "",
          mpprice: "",
          mpduration: "",
          mpsupply: "",
          mpsetasbundle: "",
          mpreserveforspecificbuyer: "",
          mpfees: "",
          mpstartingprice: "",
          mpendingprice: "",
          saleid: "",
          listonmarketplace: "false"
        }
      }
    )

    res.send({ result: "Removed From MarketPlace" })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
}


exports.MarketPlaceNFTs = async (req, res) => {
  try {
  let query;

  const { to, from, blockchain = "", assettype = "", sortby } = req.query;

  let queryStr = {};

  if (blockchain === "" || assettype === "") {
    queryStr = {};
  } else {
    queryStr = {
      blockchain,
      typeofart: assettype,
      estimatedvalue: { $gte: from, $lte: to },
      listonmarketplace: "true",
    };
  }

  query = NFTprofileDetailModel.find(queryStr);

  if (sortby) {
    const sortBy = sortby.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 30;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await NFTprofileDetailModel.countDocuments(queryStr);
  query = query.skip(startIndex).limit(limit);

  const results = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  return res.status(200).json({
    success: true,
    count: results.length,
    pagination,
    data: results,
  });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
};
