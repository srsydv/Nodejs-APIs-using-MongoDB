const asyncHandler = require("../middleware/async");
const ValidatorModel = require("../models/Validator-profile");

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
