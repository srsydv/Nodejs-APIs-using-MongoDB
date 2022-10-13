const asyncHandler = require("../middleware/async");
const NftModel = require("../models/Nftprofiledetail");

exports.getNfts = asyncHandler(async (req, res, next) => {
  try {
    const nfts = await NftModel.find();
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

exports.createNft = asyncHandler(async (req, res, next) => {
  try {
    const nft = await NftModel.create(req.body);
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
