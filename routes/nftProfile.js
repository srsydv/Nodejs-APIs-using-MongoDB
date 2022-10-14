const express = require("express");
const { getNfts, createNft } = require("../controllers/nftProfile");
const NFTprofilelController = require("../controllers/nftProfile");
const advancedResults = require("../middleware/advancedResults");
const NftModel = require("../models/Nftprofiledetail");
const access_token = require("../services/token.services")

const router = express.Router();

// router.route("/").get(getNfts).post(createNft);

router.route("/createNFT").get(advancedResults(NftModel), getNfts).post(createNft);

// NFT Detail By Tokenid
router.route("/NFTdetail").get(access_token.authenticateJWT, NFTprofilelController.NFTdetail);

module.exports = router;
