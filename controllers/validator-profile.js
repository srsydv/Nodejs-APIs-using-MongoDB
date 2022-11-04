const asyncHandler = require("../middleware/async");
const ValidatorModel = require("../models/Validator-profile");
const nftForValidation = require("../models/NftForValidation")
const NFTprofileDetailModel = require("../models/Nftprofiledetail")
const userModel = require("../models/User-profile");
const UserModel = require("../models/User-profile");
const userActivityModel = require("../models/user-activity");
const validatorActivityModel = require("../models/validator-activity")
const NftForValidationModel = require("../models/NftForValidation")
const validatorHelper = require("../middleware/validator-helper")
const userHelper = require("../middleware/user-helper")
const jwt = require('jsonwebtoken')
const moment = require('moment');

exports.getValidators = asyncHandler(async (req, res, next) => {
  try {
    const nfts = await ValidatorModel.find().populate("favourite");
    if (!nfts) {
      res.json({
        success: true,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: nfts,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
});

exports.createValidator = asyncHandler(async (req, res, next) => {
  try {
    const nft = await ValidatorModel.create(req.body);
    if (!nft) {
      res.json({
        success: true,
        data: [],
      });
    }
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


exports.validatorloginAsUser = async function (req, res) {
  try {
    const clm = {
      address: (req.body.address).toLowerCase()
    }
    const authuser1 = {
      address: (req.body.address).toLowerCase(),
      hostname: "",
      ip: "",
      sessionID: req.session.id,
      lastRequestAt: req.session._lastRequestAt
    };
    const data1 = await validatorHelper.loginAsUser(clm);
    if (!data1[0]) {
      const insAdd = await validatorHelper.insertAddAsUser(authuser1);
    }
    const data = await validatorHelper.loginAsUser(clm);
    const access_token = jwt.sign({
      address: (data[0].address).toLowerCase()
    },
      process.env.JWT_SECRET, {
      expiresIn: "5d"
    });

    let useralldata = data[0];
    data[0].password = "NahiBataunga";

    res.send({
      message: 'Authorized User',
      accessToken: access_token,
      user: useralldata
    })

  } catch (error) {
    res.status(301).json({
      success: false,
      data: [],
      message: "Failed to login as User",
    });
  }
};



exports.EditvalidatorProfile = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const validatorDetail = await validatorHelper.validatorDetail(user.address);
    if (validatorDetail[0].username == req.body.username) {
      res.send({ result: "username already exist" })
    }
    else {
      let result = await ValidatorModel.updateMany(
        { address: user.address },
        {
          $set:
          {
            name: req.body.name,
            username: req.body.username,
            bio: req.body.bio,
            profilepic: req.body.profilepic,
            profilebanner: req.body.profilebanner,
            homeaddress: req.body.homeaddress,
            city: req.body.city,
            email: req.body.email,
            phone: req.body.phone,
            twitter: req.body.twitter,
            facebook: req.body.facebook,
            instagram: req.body.instagram,
            websiteurl: req.body.websiteurl
          }
        }
      )

      res.send({ result: "updated" })
    }

  } catch (error) {
    res.status(301).json({
      success: false,
      data: [],
      message: "Failed to edit Profile",
    });
  }

}



exports.validatorsProfile = async (req, res) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to edit Profile",
    });
  }

}



exports.RequestforValidation = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    let query;

    const { sortby = "latest" } = req.query;

    let queryStr = {
      validatorwltaddressforvld: user.address,
      validationstate: "pending"
    }

    //here $ne means not equal to

    query = NftForValidationModel.find(queryStr);

    if (sortby === "oldest") {
      query = query.sort("createdAt");
    } else {
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await NftForValidationModel.countDocuments(queryStr);
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
      totalCount: total,
      pagination: results.length ? pagination : {},
      data: results,
    });
  } catch (error) {
    console.log("sss",error)
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to edit Profile",
    });
  }

}



exports.validateNFT = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const validatorDetail = await validatorHelper.validatorDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);
    const userDetail = await userHelper.userDetail(user.address);

    let result = await nftForValidation.updateMany(
      {
        tokenid: req.body.tokenid,
        validatorwltaddressforvld: user.address
      },
      {
        $set:
        {
          validationstate: "validated",
          validatorname: validatorDetail[0].name,
          validatorusername: validatorDetail[0].username,
          validatorwltaddress: validatorDetail[0].address,
          validateAmount: req.body.validateAmount
        }
      }
    )


    let newActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      validatorwltaddress: user.address,
      validatorname: validatorDetail[0].name,
      validatorusername: validatorDetail[0].username,
      message: "NFT Validated",
      DateAndTime: moment().format(),
      username: NFTdetail[0].ownerusername,
      name: NFTdetail[0].ownername,
      userwltaddress: NFTdetail[0].ownerwltaddress,
      validateAmount: req.body.validateAmount

    })
    await newActivityForUser.save();



    let newActivityForValidator = new validatorActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      validatorwltaddress: user.address,
      validatorname: validatorDetail[0].name,
      validatorusername: validatorDetail[0].username,
      createrusername: NFTdetail[0].createrusername,
      creatername: NFTdetail[0].creatername,
      createrwltaddress: NFTdetail[0].createrwltaddress,
      userWltAddress: user.address,
      message: "Validation Request",
      DateAndTime: moment().format(),
      usernameofuser: NFTdetail[0].ownerusername,
      nameofuser: NFTdetail[0].ownername,
      userwltaddress: NFTdetail[0].ownerwltaddress,
      DateAndTime: moment().format()

    })
    await newActivityForValidator.save();


    await NFTprofileDetailModel.updateMany(
      { tokenid: req.body.tokenid },
      {
        $set:
        {
          validationstate: "validated",
          validatorname: validatorDetail[0].name,
          validatorusername: validatorDetail[0].username,
          validatorwltaddress: user.address,
          validateAmount: req.body.validateAmount
        }
      }
    )

    res.send({ result: "Validated" })

  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "validation Failed",
    });
  }
}



exports.MyValidatedNFT = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    let data = await nftForValidation.find({ validationstate: "validated", validatorwltaddress: user.address });
    res.send({ result: data })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed",
    });
  }

}


exports.acceptRedeemReq = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const validatorDetail = await validatorHelper.validatorDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);
    const userDetail = await userHelper.userDetail(user.address);


    let newActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      validatorwltaddress: user.address,
      validatorname: validatorDetail[0].name,
      validatorusername: validatorDetail[0].username,
      message: "Request Accepted for Redeem",
      DateAndTime: moment().format(),
      username: NFTdetail[0].ownerusername,
      name: NFTdetail[0].ownername,
      userwltaddress: NFTdetail[0].ownerwltaddress
    })
    await newActivityForUser.save();

    await NFTprofileDetailModel.updateMany(
      {
        tokenid: req.body.tokenid
      },
      {
        $set:
        {
          redeemNFTrequest: "accepted"
        }
      }
    )

    res.json({
      message: "Request Accepted"
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Cant Accept request",
    });
  }

}

exports.getAllActivities = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    let query;

    const { activity, sortby = "latest" } = req.query;

    let queryStr = {
      message: activity,
      validatorwltaddress: user.address
    }

    query = validatorActivityModel.find(queryStr);

    if (sortby === "oldest") {
      query = query.sort("createdAt");
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
      totalCount: total,
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

exports.getFavouriteNfts = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    let user = jwt.decode(token, process.env.JWT_SECRET);

    const nfts = await ValidatorModel.find({ address: user.address }).populate("favourite");
    if (!nfts) {
      res.json({
        success: true,
        count: nfts.length,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      totalCount: nfts.length,
      data: nfts,
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
});

exports.addFavouriteNft = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    let user = jwt.decode(token, process.env.JWT_SECRET);

    const { id } = req.body;

    const favouriteNfts = await ValidatorModel.find({ address: user.address }).select('favourite');

    let data = favouriteNfts[0].favourite.length ? favouriteNfts[0].favourite : [];
    if (data.length) {
      if (data.includes(id)) {
        data = data.filter(d => d.toString() !== id);
      } else {
        data.push(id);
      }
    } else {
      data.push(id);
    }

    const nft = await ValidatorModel.findOneAndUpdate({ address: user.address }, { favourite: data });

    res.status(200).json({
      success: true
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
});

exports.ReadTheNotification = async function (req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET);

    const hi = await validatorActivityModel.updateMany(
      {
        id: req.body.mongoid
      },
      {
        $set:
        {
          markasread: "read"
        }
      }
    )

    res.send({ result: "read" })


  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to edit Profile",
    });
  }
}