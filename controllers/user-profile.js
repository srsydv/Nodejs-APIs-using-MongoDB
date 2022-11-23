const asyncHandler = require("../middleware/async");
const UserModel = require("../models/User-profile");
const NftModel = require("../models/Nftprofiledetail");
const validatorModel = require("../models/Validator-profile");
const validatorActivity = require("../models/validator-activity")
const NFTforValidationModel = require("../models/NftForValidation");
const NFTprofileDetailModel = require("../models/Nftprofiledetail");
const userActivityModel = require("../models/user-activity");
const userHelper = require("../middleware/user-helper")
const validatorHelper = require("../middleware/validator-helper")
const jwt = require('jsonwebtoken')
const moment = require('moment');
const { query } = require("express");

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
    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);
    const validatorDetail = await validatorHelper.validatorDetail(req.body.validatorwltaddress);

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


    await NFTprofileDetailModel.updateOne(
      {
        address: user.address,
        tokenid: req.body.tokenid
      },
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
      message: "Validation Request",
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


exports.SearchNFTbyname = async (req, res) => {
  try {
    let query;

    const { assetname = "" } = req.query;

    let queryStr = {
      assetname: { $regex: "^" + assetname }
    }

    query = NftModel.find(queryStr);
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
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);

    let ActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "you baught nft",
      DateAndTime: moment().format(),
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      buyamount: req.body.buyamount
    })
    await ActivityForUser.save();
    console.log("sss", user.address)

    let newActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "your nft sold",
      DateAndTime: moment().format(),
      username: NFTdetail[0].ownerusername,
      name: NFTdetail[0].ownername,
      userwltaddress: NFTdetail[0].ownerwltaddress,
      buyamount: req.body.buyamount
    })
    await newActivityForUser.save();

    let result = await NFTprofileDetailModel.updateMany(
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
          ownerusername: userDetail[0].username,
          buyamount: req.body.buyamount,
          mptype: "",
          mpprice: "",
          mpduration: "",
          mpsupply: "",
          mpsetasbundle: "",
          mpfees: "",
          listonmarketplace: "false",
        }
      }
    )

    await NFTprofileDetailModel.findOneAndUpdate(
      {
        tokenid: req.body.tokenid
      },
      {
        $push: {
          history: [
            {
              userwltaddress: user.address,
              username: userDetail[0].username,
              name: userDetail[0].name,
              message: "NFT Baught",
              dateandtime: moment().format(),
            }
          ],
        }
      }
    )

    res.send({
      Result: "You Baught this NFT"
    });
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
    const otherNFTdetail = await userHelper.NFTdetails(req.body.toswaptokenid);
    let newActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      // Here will be out sign for swap request
      message: "Swap Request OUT",
      DateAndTime: moment().format(),
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      toswapassetname: req.body.toswapassetname,
      toswaptokenid: req.body.toswaptokenid,
      //This address will also get notification for swap Request IN
      swaprequestuserwltAddress: otherNFTdetail[0].ownerwltaddress,
      swaprequestname: otherNFTdetail[0].ownername,
      swaprequestusername: otherNFTdetail[0].username,
      swapid: req.body.swapid,
      swapstatus: "you send swap request"
    })
    await newActivityForUser.save();

    let getSwapReq = new userActivityModel({

      assetname: req.body.toswapassetname,
      tokenid: req.body.toswaptokenid,
      message: "Swap Request IN",
      DateAndTime: moment().format(),
      username: NFTdetail[0].username,
      name: NFTdetail[0].name,
      userwltaddress: otherNFTdetail[0].ownerwltaddress,
      toswapassetname: req.body.assetname,
      toswaptokenid: req.body.tokenid,
      swaprequestuserwltAddress: user.address,
      swaprequestname: userDetail[0].name,
      swaprequestusername: userDetail[0].username,
      swapid: req.body.swapid,
      swapstatus: "you got swap request"
    })
    await getSwapReq.save();

    await NFTprofileDetailModel.updateOne(
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

    await NFTprofileDetailModel.updateOne(
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
    console.log("hh",error)
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to edit Profile",
    });
  }
}



exports.acceptSwapRequest = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.toswaptokenid);

    let newActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "You Accepted swap Request",
      DateAndTime: moment().format(),
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      toswapassetname: req.body.toswapassetname,
      toswaptokenid: req.body.toswaptokenid,
      swaprequesttouserwltAddress: NFTdetail[0].ownerwltaddress,
      swaprequesttoname: NFTdetail[0].ownername,
      swaprequesttousername: NFTdetail[0].ownerusername,
      swapid: req.body.swapid,
      swapstatus: "you accepted"
    })
    await newActivityForUser.save();


    let getSwapped = new userActivityModel({

      assetname: req.body.toswapassetname,
      tokenid: req.body.toswaptokenid,
      message: "Your Swap Request is Accepted",
      DateAndTime: moment().format(),
      username: NFTdetail[0].ownerusername,
      name: NFTdetail[0].ownername,
      userwltaddress: NFTdetail[0].ownerwltaddress,
      toswapassetname: req.body.assetname,
      toswaptokenid: req.body.tokenid,
      swaprequestuserwltAddress: user.address,
      swaprequestname: userDetail[0].name,
      swaprequestusername: userDetail[0].username,
      swapid: req.body.swapid,
      swapstatus: "your req accepted"
    })
    await getSwapped.save();

    await NFTprofileDetailModel.updateOne(
      {
        tokenid: req.body.tokenid,
      },
      {
        $set:
        {
          swapStatus: `Swapped with tokenId ${req.body.toswaptokenid}`,
          ownerusername: NFTdetail[0].ownerusername,
          ownername: NFTdetail[0].ownername,
          ownerwltaddress: NFTdetail[0].ownerwltaddress
        }
      }
    )



    await NFTprofileDetailModel.updateOne(
      {
        tokenid: req.body.toswaptokenid,
      },
      {
        $set:
        {
          swapStatus: `Swapped with tokenId ${req.body.tokenid}`,
          ownerusername: userDetail[0].username,
          ownername: userDetail[0].name,
          ownerwltaddress: userDetail[0].address
        }
      }
    )

    await NFTprofileDetailModel.findOneAndUpdate(
      {
        tokenid: req.body.tokenid
      },
      {
        $push: {
          history: [
            {
              message: "NFT Swapped",
              toswaptokenid: req.body.toswaptokenid,
              dateandtime: moment().format(),
            }
          ],
        }
      }
    )

    await NFTprofileDetailModel.findOneAndUpdate(
      {
        tokenid: req.body.toswaptokenid
      },
      {
        $push: {
          history: [
            {
              message: "NFT Swapped",
              toswaptokenid: req.body.tokenid,
              dateandtime: moment().format(),
            }
          ],
        }
      }
    )


    res.send({ result: "Swapped Successfully" })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to accept swap request",
    });
  }
}


exports.cancleSwapRequest = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);


    let newActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "Swap Request Cancled",
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

      assetname: req.body.toswapassetname,
      tokenid: req.body.toswaptokenid,
      message: "Swap Request Cancled",
      DateAndTime: moment().format(),
      username: NFTdetail[0].ownerusername,
      name: NFTdetail[0].ownername,
      userwltaddress: NFTdetail[0].ownerwltaddress,
      toswapassetname: req.body.assetname,
      toswaptokenid: req.body.tokenid,
      swaprequestuserwltAddress: user.address,
      swaprequestname: userDetail[0].name,
      swaprequestusername: userDetail[0].username,
    })
    await getSwapped.save();



    await NFTprofileDetailModel.updateOne(
      {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
      },
      {
        $set:
        {
          swapStatus: `Swap Request Cancled with tokenId ${req.body.toswaptokenid}`
        }
      }
    )


    res.send({ result: "Swap Request Cancled" })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to accept swap request",
    });
  }
}


exports.rejectSwapRequest = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);


    let newActivityForUser = new userActivityModel({

      assetname: req.body.toswapassetname,
      tokenid: req.body.toswaptokenid,
      message: "You Rejected Swap Request",
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


    let newActivityForOtherUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "Your Swap Request is Rejected",
      DateAndTime: moment().format(),
      username: NFTdetail[0].ownerusername,
      name: NFTdetail[0].ownername,
      userwltaddress: NFTdetail[0].ownerwltaddress,
      toswapassetname: req.body.assetname,
      toswaptokenid: req.body.tokenid,
      swaprequestuserwltAddress: user.address,
      swaprequestname: userDetail[0].name,
      swaprequestusername: userDetail[0].username,
    })
    await newActivityForOtherUser.save();



    await NFTprofileDetailModel.updateOne(
      {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
      },
      {
        $set:
        {
          swapStatus: `Swap Request Rejected with tokenId ${req.body.toswaptokenid}`
        }
      }
    )


    res.send({ result: "Swap Request Rejected" })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to accept swap request",
    });
  }
}


exports.burnNFT = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);
    const validatorDetail = await validatorHelper.validatorDetail(req.body.validatorwltaddress);

    let ActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "NFT burned",
      DateAndTime: moment().format(),
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      validatorname: validatorDetail[0].name,
      validatorusername: validatorDetail[0].username,
      validatorwltaddress: validatorDetail[0].validatorwltaddress
    })
    await ActivityForUser.save();



    let ActivityForValidator = new validatorActivity({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      validatorwltaddress: req.body.validatorwltaddress,
      validatorname: validatorDetail[0].name,
      validatorusername: validatorDetail[0].username,
      //Because only owner can burn it so in owner clm user data will be storing
      //In UI we "Burned by Address" insted of ownerwltaddress
      ownerusername: userDetail[0].username,
      ownername: userDetail[0].name,
      ownerwltaddress: user.address,
      createrusername: NFTdetail[0].createrusername,
      creatername: NFTdetail[0].creatername,
      createrwltaddress: NFTdetail[0].createrwltaddress,
      userWltAddress: user.address,
      message: "Burned",
      DateAndTime: moment().format()

    })
    await ActivityForValidator.save();

    await NFTprofileDetailModel.deleteOne(
      {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
      }
    )

    // await NFTprofileDetailModel.findOneAndUpdate(
    //   {
    //     tokenid: req.body.tokenid
    //   },
    //   {
    //     $push: {
    //       history: [
    //         {
    //           userwltaddress: user.address,
    //           username: userDetail[0].username,
    //           name: userDetail[0].name,
    //           message: "NFT Burned",
    //           dateandtime: moment().format(),
    //         }
    //       ],
    //     }
    //   }
    // )

    res.send({ result: "NFT Burned, Successfully" })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed For Burn NFT",
    });
  }
}




exports.sendredeemreq = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);
    const validatorDetail = await validatorHelper.validatorDetail(req.body.validatorwltaddress);


    let ActivityForValidator = new validatorActivity({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      validatorwltaddress: req.body.validatorwltaddress,
      validatorname: validatorDetail[0].name,
      validatorusername: validatorDetail[0].username,
      //Because only owner can send request so in owner clm user data will be storing
      //In UI we can show "Redeem request by" insted of "ownerwltaddress"
      ownerusername: userDetail[0].username,
      ownername: userDetail[0].name,
      ownerwltaddress: user.address,
      createrusername: NFTdetail[0].createrusername,
      creatername: NFTdetail[0].creatername,
      createrwltaddress: NFTdetail[0].createrwltaddress,
      userWltAddress: user.address,
      message: "asset request",
      DateAndTime: moment().format()

    })
    await ActivityForValidator.save();


    await NFTprofileDetailModel.updateMany(
      {
        tokenid: req.body.tokenid,
        ownerwltaddress: user.address
      },
      {
        $set:
        {
          redeemNFTrequest: "true"
        }
      }
    )

    res.json({
      message: "Request send"
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed For Sending Request",
    });
  }
}



exports.redeemNFT = async (req, res) => {

  try {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);
    const validatorDetail = await validatorHelper.validatorDetail(req.body.validatorwltaddress);

    let ActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "redeem nft",
      DateAndTime: moment().format(),
      //Asset NFT Reciever (You)
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      //Locked Money Reciever (Validator)
      validatorname: validatorDetail[0].name,
      validatorusername: validatorDetail[0].username,
      validatorwltaddress: validatorDetail[0].validatorwltaddress
    })
    await ActivityForUser.save();



    let ActivityForValidator = new validatorActivity({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      validatorwltaddress: req.body.validatorwltaddress,
      validatorname: validatorDetail[0].name,
      validatorusername: validatorDetail[0].username,
      ownerusername: userDetail[0].username,
      ownername: userDetail[0].name,
      ownerwltaddress: user.address,
      createrusername: NFTdetail[0].createrusername,
      creatername: NFTdetail[0].creatername,
      createrwltaddress: NFTdetail[0].createrwltaddress,
      userWltAddress: user.address,
      message: "redeem nft",
      DateAndTime: moment().format()

    })
    await ActivityForValidator.save();


    await NFTprofileDetailModel.updateMany(
      {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
      },
      {
        $set:
        {
          redeemNFTrequest: "redeemed",
          validationstate: "not started",
          validatorname: "",
          validatorusername: "",
          validatorwltaddress: "",
          validateAmount: ""
        }
      }
    )

    await NFTprofileDetailModel.findOneAndUpdate(
      {
        tokenid: req.body.tokenid
      },
      {
        $push: {
          history: [
            {
              userwltaddress: user.address,
              username: userDetail[0].username,
              name: userDetail[0].name,
              message: "NFT Redeemed",
              dateandtime: moment().format(),
            }
          ],
        }
      }
    )



    res.send({ result: "NFT Redeem, Successfully" })
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to Redeem",
    });
  }
}


exports.transferNFT = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const userDetail = await userHelper.userDetail(user.address);
    const userDetailOfTransferedAdd = await userHelper.userDetail((req.body.nfttransferaddress).toLowerCase());
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);

    let ActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "NFT Transfered",
      DateAndTime: moment().format(),
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      nfttransferaddress: req.body.nfttransferaddress,
      nfttransferusername: userDetailOfTransferedAdd[0].username,
      nfttransfername: userDetailOfTransferedAdd[0].name
    })
    await ActivityForUser.save();

    let ActivityForOtherUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "NFT Received",
      DateAndTime: moment().format(),
      username: userDetailOfTransferedAdd[0].username,
      name: userDetailOfTransferedAdd[0].name,
      userwltaddress: req.body.nfttransferaddress,
      nfttransferaddress: user.address,
      nfttransferusername: userDetail[0].username,
      nfttransfername: userDetail[0].name,
    })
    await ActivityForOtherUser.save();

    await NFTprofileDetailModel.updateMany(
      {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
      },
      {
        $set:
        {
          ownerusername: userDetailOfTransferedAdd[0].username,
          ownername: userDetailOfTransferedAdd[0].name,
          ownerwltaddress: req.body.nfttransferaddress
        }
      }
    )

    await NFTprofileDetailModel.findOneAndUpdate(
      {
        tokenid: req.body.tokenid
      },
      {
        $push: {
          history: [
            {
              userwltaddress: user.address,
              username: userDetail[0].username,
              name: userDetail[0].name,
              message: "NFT Transfered",
              dateandtime: moment().format(),
            }
          ],
        }
      }
    )

    res.send({ result: "NFT Transfered, Successfully" })
  } catch (error) {
    console.log("dd", error)
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
      userwltaddress: user.address
    }

    query = userActivityModel.find(queryStr);

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
      data: results
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
});


exports.makeoffer = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);

    let ActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "you got an offer",
      DateAndTime: moment().format(),
      username: NFTdetail[0].ownerusername,
      name: NFTdetail[0].ownername,
      userwltaddress: NFTdetail[0].ownerwltaddress,
      makeofferamount: req.body.makeofferamount,
      whomadeoffer: user.address
    })
    await ActivityForUser.save();

    let ActivityForOtherUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "you made offer",
      DateAndTime: moment().format(),
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      makeofferamount: req.body.makeofferamount
    })
    await ActivityForOtherUser.save();

    res.send({ result: "Offer made, Successfully" })
  } catch (error) {
    console.log("dd", error)
  }
}


exports.placeBid = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);

    let ActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "you got a bid",
      DateAndTime: moment().format(),
      username: NFTdetail[0].ownerusername,
      name: NFTdetail[0].ownername,
      userwltaddress: NFTdetail[0].ownerwltaddress,
      bidderaddress: user.address,
      biddingamount: req.body.biddingamount,
      bidid: req.body.bidid,
      saleid: req.body.saleid,
      bidstatus: "panding"
    })
    await ActivityForUser.save();

    let ActivityForOtherUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "you made bid",
      DateAndTime: moment().format(),
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      biddingamount: req.body.biddingamount,
      bidid: req.body.bidid,
      saleid: req.body.saleid,
      bidstatus: "panding"
    })
    await ActivityForOtherUser.save();

    res.send({ result: "Bid Done, Successfully" })
  } catch (error) {
    console.log("dd", error)
  }
}



exports.withdrawBid = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);

    let ActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "a bid got withdraw",
      DateAndTime: moment().format(),
      username: NFTdetail[0].ownerusername,
      name: NFTdetail[0].ownername,
      userwltaddress: NFTdetail[0].ownerwltaddress,
      bidderaddress: user.address,
      biddingamount: req.body.biddingamount,
      bidid: req.body.bidid,
      saleid: req.body.saleid,
    })
    await ActivityForUser.save();

    let ActivityForOtherUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "you withdraw a bid",
      DateAndTime: moment().format(),
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      biddingamount: req.body.biddingamount,
      bidid: req.body.bidid,
      saleid: req.body.saleid,
    })
    await ActivityForOtherUser.save();

    // await userActivityModel.findOneAndDelete(
    //   {
    //     userwltaddress: user.address,
    //     message: "you made bid",
    //     bidid: req.body.bidid,
    //     saleid: req.body.saleid
    //   });

    // await userActivityModel.findOneAndDelete(
    //   {
    //     userwltaddress: NFTdetail[0].ownerwltaddress,
    //     message: "you got a bid",
    //     bidid: req.body.bidid,
    //     saleid: req.body.saleid
    //   });

    res.send({ result: "Bid withdraw, Successfully" })
  } catch (error) {
    console.log("dd", error)
  }
}


exports.acceptBid = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const clm = {
      bidid: req.body.bidid,
      saleid: req.body.saleid,
      message: "you made bid"
    }

    const userDetail = await userHelper.userDetail(user.address);
    const NFTdetail = await userHelper.NFTdetails(req.body.tokenid);
    const bidDetail = await userHelper.bidDetail(clm);
    let ActivityForUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "your bid got accepted",
      DateAndTime: moment().format(),
      username: bidDetail[0].username,
      name: bidDetail[0].name,
      userwltaddress: bidDetail[0].userwltaddress,
      biddingamount: req.body.biddingamount,
      bidid: req.body.bidid,
      bidstatus: "accepted"
    })
    await ActivityForUser.save();

    let ActivityForOtherUser = new userActivityModel({

      assetname: req.body.assetname,
      tokenid: req.body.tokenid,
      message: "you accepted bid",
      DateAndTime: moment().format(),
      username: userDetail[0].username,
      name: userDetail[0].name,
      userwltaddress: user.address,
      biddingamount: req.body.biddingamount,
      bidid: req.body.bidid,
      bidstatus: "accepted"
    })
    await ActivityForOtherUser.save();

    await NFTprofileDetailModel.updateMany(
      {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
      },
      {
        $set:
        {
          ownerusername: bidDetail[0].username,
          ownername: bidDetail[0].name,
          ownerwltaddress: bidDetail[0].userwltaddress,
          sellstatus: "sold",
          mptype: "",
          mpprice: "",
          mpduration: "",
          mpsupply: "",
          mpsetasbundle: "",
          mpfees: "",
          listonmarketplace: "false",
        }
      }
    )
    const res1 = await userActivityModel.findOneAndDelete(
      {
        userwltaddress: bidDetail[0].userwltaddress,
        bidid: req.body.bidid
      }
    )

    await NFTprofileDetailModel.findOneAndUpdate(
      {
        tokenid: req.body.tokenid
      },
      {
        $push: {
          history: [
            {
              userwltaddress: user.address,
              username: userDetail[0].username,
              name: userDetail[0].name,
              message: "Sold By Bid",
              dateandtime: moment().format(),
            }
          ],
        }
      }
    )

    res.send({ result: "Bid Accepted, Successfully" })
  } catch (error) {
    console.log("dd", error)
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
}



exports.checkYourBid = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)


    let queryStr = {
      userwltaddress: (user.address).toLowerCase(),
      message: "you made bid",
      tokenid: req.query.tokenid
    }

    let query = userActivityModel.find(queryStr);

    const results = await query;
    if (results.length > 0) {
      res.send({
        message: "Bid Available",
        results: results
      })
    }
    else {
      res.send({ message: "No Bid Available" })
    }


  } catch (error) {
    console.log("dd", error)
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to execute",
    });
  }
}


exports.getFavouriteNfts = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    let user = jwt.decode(token, process.env.JWT_SECRET);

    const nfts = await UserModel.find({ address: user.address }).populate("favourite");
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

    const favouriteNfts = await UserModel.find({ address: user.address }).select('favourite');

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

    const nft = await UserModel.findOneAndUpdate({ address: user.address }, { favourite: data });

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


exports.checkUsername = async function (req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await userHelper.userDetailUsingUsername(req.query.username);
    if (userDetail[0]) {
      res.send({ result: "username already exist" })
    }
    else {
      res.send({
        result: "new username"
      })
    }

  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: "Failed to edit Profile",
    });
  }
}



exports.ReadTheNotification = async function (req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET);

    const hi = await userActivityModel.updateMany(
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