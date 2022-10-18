const express = require("express");
const NFTprofileController = require("../controllers/nftProfile");
const advancedResults = require("../middleware/advancedResults");
const NftModel = require("../models/Nftprofiledetail");
const access_token = require("../services/token.services")

const router = express.Router();

// router.route("/").get(getNfts).post(createNft);

router.route("/createNFT").get(advancedResults(NftModel), NFTprofileController.getNfts).post(NFTprofileController.createNft);

// NFT Detail By Tokenid
router.route("/NFTdetail").get(access_token.authenticateJWT, NFTprofileController.NFTdetail);

router.route("/userNFTs").get(NFTprofileController.getUserNfts);

router.route("/userCreatedNFTs").get(NFTprofileController.getUserCreatedNfts);

router.route('/myValidatedNFTs').get(access_token.authenticateJWT, NFTprofileController.getMyValidatedNfts);

router.route('/userValidatedNFTs').get(NFTprofileController.getValidatedNfts);

module.exports = router;