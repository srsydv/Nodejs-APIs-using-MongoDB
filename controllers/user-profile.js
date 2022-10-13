const asyncHandler = require("../middleware/async");
const UserModel = require("../models/User-profile");

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
