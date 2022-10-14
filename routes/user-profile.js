const express = require("express");
const userController = require("../controllers/user-profile");
const access_token = require("../services/token.services")
const NftprofiledetailModel = require("../models/Nftprofiledetail")
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/").get(userController.getUsers).post(userController.createUser);

//edit Profile of user
router.route("/editProfile").post(access_token.authenticateJWT, userController.editProfile);

// send NFT for validation by user
router.route("/NFTforValidation").post(access_token.authenticateJWT, userController.NFTforValidation);

// Search NFT by name
// router.route("/SearchNFTbyname").get(access_token.authenticateJWT,advancedResults(NftprofiledetailModel),userController.SearchNFTbyname);

// On Sale NFTs of single user
router.route("/onSaleNFTs").get(access_token.authenticateJWT, advancedResults(NftprofiledetailModel), userController.onSaleNFTs);

//Buy NFT by User
router.route("/buyNFT").post(access_token.authenticateJWT, userController.buyNFT);

// Send Swap Request
router.route("/reqForSwapAsset").post(access_token.authenticateJWT, userController.reqForSwapAsset);

// Accept Swap Request
router.route("/acceptSwapRequest").post(access_token.authenticateJWT, userController.acceptSwapRequest);

module.exports = router;
