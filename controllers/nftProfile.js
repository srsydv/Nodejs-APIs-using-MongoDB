const asyncHandler = require("../middleware/async");
const NftModel = require("../models/Nftprofiledetail");
const userHelper = require("../middleware/user-helper")
const moment = require('moment');
const jwt = require('jsonwebtoken')

exports.getNfts = asyncHandler(async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);

  } catch (err) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
});

exports.createNft = asyncHandler(async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const userDetail = await userHelper.userDetail(user.address);


    let newNFT = new NftModel({

      tokenid: req.body.tokenid,
      assetname: req.body.assetname,
      typeofart: req.body.typeofart,
      dimension: req.body.dimension,
      bio: req.body.bio,
      createrusername: userDetail[0].username,
      creatername: userDetail[0].name,
      createrwltaddress: userDetail[0].address,
      ownerusername: userDetail[0].username,
      ownername: userDetail[0].name,
      ownerwltaddress: userDetail[0].address,
      city: userDetail[0].city,
      dateofcreation: req.body.dateofcreation,
      marking: req.body.marking,
      provenance: req.body.provenance,
      estimatedvalue: req.body.estimatedvalue,
      evidenceofownership: req.body.evidenceofownership,
      nftimage: req.body.nftimage,
      nftimage1: req.body.nftimage1,
      nftimage2: req.body.nftimage2,
      nftimage3: req.body.nftimage3,
      blockchain: req.body.blockchain,
      ipfsmetadataurl: req.body.ipfsmetadataurl,
      nftcreationdate: moment().format(),
      validatorname: "",
      validatorusername: "",
      validatorwltaddress: "",
      validateAmount: "",
      mptype: "",
      mpprice: "",
      mpduration: "",
      mpsupply: "",
      mpsetasbundle: "",
      mpreserveforspecificbuyer: "",
      mpfees: "",
      swapStatus: "not started",
      burnNFTstatus: "false",
      listonmarketplace: "false"

    })
    await newNFT.save();
    res.status(201).json({
      success: true,
    });

  } catch (err) {
    res.status(301).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
});


exports.NFTdetail = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    let data = await NftModel.find({ tokenid: req.query.tokenid });
    res.send({ result: data })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed",
    });
  }
}

exports.getUserNfts = asyncHandler(async (req, res, next) => {
  try {
    let query;

    const {useraddress, sortby="latest"} = req.query;

    let queryStr = {
      ownerwltaddress: useraddress
    }

    query = NftModel.find(queryStr);

    if(sortby === "oldest"){
      query = query.sort("createdAt");
    }else{
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await NftModel.countDocuments(queryStr);
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
      pagination: results.length ? pagination : {},
      data: results,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
});

exports.getUserCreatedNfts = asyncHandler(async (req, res, next) => {
  try {
    let query;

    const {useraddress, sortby="latest"} = req.query;

    let queryStr = {
      createrwltaddress: useraddress
    }

    query = NftModel.find(queryStr);

    if(sortby === "oldest"){
      query = query.sort("createdAt");
    }else{
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await NftModel.countDocuments(queryStr);
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
      pagination: results.length ? pagination : {},
      data: results,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
});

exports.getMyValidatedNfts = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    let user = jwt.decode(token, process.env.JWT_SECRET)

    let query;

    const {sortby="latest", state="all"} = req.query;

    let queryStr = {
      ownerwltaddress: user.address,
    }

    if(state === "validated"){
      queryStr["validationstate"] = "validated";
    }else if(state === "redeemed"){
      queryStr["redeemNFTrequest"] = "redeemed";
    }else if(state === "asset requested"){
      queryStr["redeemNFTrequest"] = "accepted";
    }else if(state === "burned"){
      queryStr["burnNFTstatus"] = "true"
    }

    query = NftModel.find(queryStr);

    if(sortby === "oldest"){
      query = query.sort("createdAt");
    }else{
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await NftModel.countDocuments(queryStr);
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
      pagination: results.length ? pagination : {},
      data: results,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
});

exports.getValidatedNfts = asyncHandler(async (req, res, next) => {
  try {
    let query;

    const {useraddress, sortby="latest", state="all"} = req.query;

    let queryStr = {
      ownerwltaddress: useraddress,
    }

    if(state === "validated"){
      queryStr["validationstate"] = "validated";
    }else if(state === "redeemed"){
      queryStr["redeemNFTrequest"] = "redeemed";
    }else if(state === "asset requested"){
      queryStr["redeemNFTrequest"] = "accepted";
    }else if(state === "burned"){
      queryStr["burnNFTstatus"] = "true"
    }

    query = NftModel.find(queryStr);

    if(sortby === "oldest"){
      query = query.sort("createdAt");
    }else{
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await NftModel.countDocuments(queryStr);
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
      pagination: results.length ? pagination : {},
      data: results,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
});