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

exports.getUsers = asyncHandler(async (req, res, next) => {
  try {
    const nfts = await UserModel.find().populate('favourite');
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

exports.createUser = asyncHandler(async (req, res, next) => {
  try {
    const nft = await UserModel.create(req.body);
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


exports.editProfile = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const userDetail = await userHelper.userDetail(user.address);
    if (userDetail[0].username == req.body.username) {
      res.send({ result: "username already exist" })
    }
    else {
      let result = await UserModel.updateMany(
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
      message: "Failed to edit profile",
    });
  }

}



exports.NFTforValidation = async function (req, res) {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    // const detailsOfUser = await validatorModel.detailsOfUser(user.address)
    const userDetail = await userHelper.userDetail(user.address);
    console.log("hh", userDetail[0])
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);
    console.log("hh1", NFTdetail[0])
    const validatorDetail = await validatorHelper.validatorDetail(req.body.validatorwltaddress);
    console.log("gg", validatorDetail[0])

    let validationReqData = new NFTforValidationModel({
      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      ownerusername: NFTdetail[0].ownerusername,
      ownername: NFTdetail[0].ownername,
      ownerwltaddress: NFTdetail[0].ownerwltaddress,
      createrusername: NFTdetail[0].createrusername,
      creatername: NFTdetail[0].creatername,
      createrwltaddress: NFTdetail[0].createrwltaddress,
      address: user.address,
      validationstate: "pending",
      city: userDetail[0].city,
      homeaddress: userDetail[0].homeaddress,
      estimatedvalue: NFTdetail[0].estimatedvalue,
      validatorwltaddressforvld: req.body.validatorwltaddress,
      validatornameforvld: validatorDetail[0].name,
      validatorusernameforvld: validatorDetail[0].username,
      nftimage: NFTdetail[0].nftimage,
      nftimage1: NFTdetail[0].nftimage1,
      nftimage2: NFTdetail[0].nftimage2,
      nftimage3: NFTdetail[0].nftimage3,
      sendforvalidationdate: moment().format()

    })
    await validationReqData.save();


    await NFTprofileDetailModel.updateMany(
      { address: user.address },
      {
        $set:
        {
          validationstate: "pending"
        }
      }
    )

    let newActivityForValidator = new validatorActivity({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      validatorwltaddress: req.body.validatorwltaddress,
      validatorname: validatorDetail[0].name,
      validatorusername: validatorDetail[0].username,
      ownerusername: NFTdetail[0].ownerusername,
      ownername: NFTdetail[0].ownername,
      ownerwltaddress: NFTdetail[0].ownerwltaddress,
      createrusername: NFTdetail[0].createrusername,
      creatername: NFTdetail[0].creatername,
      createrwltaddress: NFTdetail[0].createrwltaddress,
      userWltAddress: user.address,
      Message: "Validation Request",
      DateAndTime: moment().format()

    })
    await newActivityForValidator.save();

    res.send({
      message: 'NFT has been sent'
    })

  } catch (error) {
    res.status(301).json({
      success: false,
      data: [],
      message: "Failed to edit profile",
    });
  }
}

