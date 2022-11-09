const express = require("express");
const NFTprofileController = require("../controllers/nftProfile");
const advancedResults = require("../middleware/advancedResults");
const NftModel = require("../models/Nftprofiledetail");
const access_token = require("../services/token.services")

const router = express.Router();

// router.route("/").get(getNfts).post(createNft);

router.route("/createNFT").get(advancedResults(NftModel), NFTprofileController.getNfts).post(access_token.authenticateJWT, NFTprofileController.createNft);

// NFT Detail By Tokenid
router.route("/NFTdetail").get(access_token.authenticateJWT, NFTprofileController.NFTdetail);

// All NFTs of single user for public Dashboard
router.route("/userNFTs").get(access_token.authenticateJWT,NFTprofileController.getUserNfts);

// Created NFTs of single user for Dashboard
router.route("/userCreatedNFTs").get(access_token.authenticateJWT,NFTprofileController.getUserCreatedNfts);

// Validated NFT of a single user for personal Dashboard
router.route('/myValidatedNFTs').get(access_token.authenticateJWT, NFTprofileController.getMyValidatedNfts);

// Validated NFT of a single user for public Dashboard
router.route('/userValidatedNFTs').get(access_token.authenticateJWT,NFTprofileController.getValidatedNfts);

module.exports = router;