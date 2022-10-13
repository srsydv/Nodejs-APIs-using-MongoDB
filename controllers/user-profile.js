const asyncHandler = require("../middleware/async");
const UserModel = require("../models/User-profile");
const userHelper = require("../middleware/user-helper")
const jwt = require('jsonwebtoken')

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

  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  var user = jwt.decode(token, process.env.JWT_SECRET)

  const userDetail = await userHelper.userDetail(user.address);
  if(userDetail[0].username == req.body.username){
      res.send({result : "username already exist"})
  }
  else{
      let result = await UserModel.updateMany(
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
}
