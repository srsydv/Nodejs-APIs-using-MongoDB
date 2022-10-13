const express = require("express");
const { getNfts, createNft } = require("../controllers/nftProfile");
const advancedResults = require("../middleware/advancedResults");
const NftModel = require("../models/Nftprofiledetail");

const router = express.Router();

// router.route("/").get(getNfts).post(createNft);

router.route("/createNFT").get(advancedResults(NftModel),getNfts).post(createNft);


module.exports = router;
