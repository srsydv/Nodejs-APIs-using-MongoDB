const asyncHandler = require("../middleware/async");
const ValidatorModel = require("../models/Validator-profile");
const userModel = require("../models/User-profile");
const UserModel = require("../models/User-profile");
const validatorHelper = require("../middleware/validator-helper")
const userHelper = require("../middleware/user-helper")
const jwt = require('jsonwebtoken')

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
if(validatorDetail[0].username == req.body.username){
    res.send({result : "username already exist"})
}
else{
    let result = await ValidatorModel.updateMany(
        {address : user.address},
        {$set : 
            {
                name:req.body.name,
                username:req.body.username,
                bio:req.body.bio,
                profilepic:req.body.profilepic,
                profilebanner:req.body.profilebanner,
                homeaddress:req.body.homeaddress,
                city:req.body.city,
                email:req.body.email,
                phone:req.body.phone,
                twitter:req.body.twitter,
                facebook:req.body.facebook,
                instagram:req.body.instagram,
                websiteurl:req.body.websiteurl
            }
        }
    )
    
    res.send({result : "updated"})
}
    
  } catch (error) {
    res.status(301).json({
      success: false,
      data: [],
      message: "Failed to edit Profile",
    });
  }
  
}
