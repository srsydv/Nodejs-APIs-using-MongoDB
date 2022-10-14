const asyncHandler = require("../middleware/async");
const UserModel = require("../models/User-profile");
const validatorModel = require("../models/Validator-profile");
const validatorActivity = require("../models/validator-activity")
const userActivity = require("../models/user-activity")
const NFTforValidationModel = require("../models/NftForValidation");
const NFTprofileDetailModel = require("../models/Nftprofiledetail");
const userActivityModel = require("../models/user-activity");
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
      sendforvalidationdate: moment().format(),
      validatorname: "",
      validatorusername: "",
      validatorwltaddress: "",
      validateAmount: ""

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

exports.onSaleNFTs = async function (req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    let data = await NFTprofileDetailModel.find({ ownerwltaddress: user.address, sellstatus: "pending" });
    res.send({ result: data })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to edit Profile",
    });
  }
}



exports.buyNFT = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await userHelper.userDetail(user.address);

    let result = await NFTforValidationModel.updateMany(
      {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
      },
      {
        $set:
        {
          solddate: moment().format(),
          sellstatus: 'sold',
          ownername: userDetail[0].name,
          ownerwltaddress: user.address,
          ownerusername: userDetail[0].username
        }
      }
    )
    res.send(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to edit Profile",
    });
  }
}



exports.reqForSwapAsset = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);
    let newActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      // Here will be out sign for swap request
      Message: "Swap Request OUT",
      DateAndTime: moment().format(),
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      toswapassetname: req.body.toswapassetname,
      toswaptokenid: req.body.toswaptokenid,
      //This address will also get notification for swap Request IN
      swaprequestuserwltAddress: NFTdetail[0].ownerwltaddress,
      swaprequestname: NFTdetail[0].ownername,
      swaprequestusername: NFTdetail[0].username,
    })
    await newActivityForUser.save();


    let getSwapReq = new userActivityModel({

      assetname: req.body.toswapassetname,
      tokenid: req.body.toswaptokenid,
      Message: "Swap Request IN",
      DateAndTime: moment().format(),
      username: NFTdetail[0].username,
      name: NFTdetail[0].name,
      userwltaddress: NFTdetail[0].ownerwltaddress,
      toswapassetname: req.body.assetname,
      toswaptokenid: req.body.tokenid,
      swaprequestuserwltAddress: user.address,
      swaprequestname: userDetail[0].name,
      swaprequestusername: userDetail[0].username,
    })
    await getSwapReq.save();

    await NFTprofileDetailModel.updateMany(
      {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
      },
      {
        $set:
        {
          swapStatus: `Swap Request send to ${req.body.toswaptokenid}`,
        }
      }
    )

    await NFTprofileDetailModel.updateMany(
      {
        tokenid: req.body.toswaptokenid,
        assetname: req.body.toswapassetname
      },
      {
        $set:
        {
          swapStatus: `Swap Request Recieved From ${req.body.tokenid}`,
        }
      }
    )


    res.send({ result: "Swap Request Sent, Successfully" })

  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to edit Profile",
    });
  }
}



exports.acceptSwapRequest = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  var user = jwt.decode(token, process.env.JWT_SECRET)
  const userDetail = await userHelper.userDetail(user.address);
  const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);

  let newActivityForUser = new userActivityModel({

    assetname: req.body.assetname,
    tokenid: req.body.tokenid,
    Message: "You Accepted swap Request",
    DateAndTime: moment().format(),
    username: userDetail[0].username,
    name: userDetail[0].name,
    userwltaddress: user.address,
    toswapassetname: req.body.toswapassetname,
    toswaptokenid: req.body.toswaptokenid,
    swaprequesttouserwltAddress: NFTdetail[0].ownerwltaddress,
    swaprequesttoname: NFTdetail[0].ownername,
    swaprequesttousername: NFTdetail[0].username,
  })
  await newActivityForUser.save();


  let getSwapped = new userActivityModel({

    assetname: req.body.assetname,
    tokenid: req.body.tokenid,
    Message: "Your Swap Request is Accepted",
    DateAndTime: moment().format(),
    username: NFTdetail[0].username,
    name: NFTdetail[0].name,
    userwltaddress: NFTdetail[0].ownerwltaddress,
    toswapassetname: req.body.toswapassetname,
    toswaptokenid: req.body.toswaptokenid,
    swaprequestuserwltAddress: user.address,
    swaprequestname: userDetail[0].name,
    swaprequestusername: userDetail[0].username,
  })
  await getSwapped.save();


  await NFTprofileDetailModel.updateMany(
    {
      tokenid: req.body.tokenid,
      assetname: req.body.assetname
    },
    {
      $set:
      {
        swapStatus: `Swapped with tokenId ${req.body.toswaptokenid}`,
        ownerusername: NFTdetail[0].username,
        ownername: NFTdetail[0].name,
        ownerwltaddress: NFTdetail[0].ownerwltaddress
      }
    }
  )



  await NFTprofileDetailModel.updateMany(
    {
      tokenid: req.body.toswaptokenid,
      assetname: req.body.toswapassetname
    },
    {
      $set:
      {
        swapStatus: `Swapped with tokenId ${req.body.tokenid}`,
        ownerusername: userDetail[0].username,
        ownername: userDetail[0].name,
        ownerwltaddress: userDetail[0].ownerwltaddress
      }
    }
  )


  res.send({ result: "Swapped Successfully" })
}