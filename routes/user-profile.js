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
router.route("/SearchNFTbyname").get(userController.SearchNFTbyname);

// On Sale NFTs of single user
router.route("/onSaleNFTs").get(access_token.authenticateJWT, advancedResults(NftprofiledetailModel), userController.onSaleNFTs);

//Buy NFT by User
router.route("/buyNFT").put(access_token.authenticateJWT, userController.buyNFT);

// Send Swap Request
router.route("/reqForSwapAsset").post(access_token.authenticateJWT, userController.reqForSwapAsset);

// Accept Swap Request
router.route("/acceptSwapRequest").post(access_token.authenticateJWT, userController.acceptSwapRequest);

//Cancle Swap Request
router.route("/cancleSwapRequest").post(access_token.authenticateJWT, userController.cancleSwapRequest);

//Burn NFT
router.route("/burnNFT").post(access_token.authenticateJWT, userController.burnNFT);

// Send redeem request to validator
router.route("/sendredeemreq").post(access_token.authenticateJWT, userController.sendredeemreq);

//Redeem NFT
router.route("/redeemNFT").post(access_token.authenticateJWT, userController.redeemNFT);

//Transfer NFT
router.route("/transferNFT").post(access_token.authenticateJWT, userController.transferNFT);

//All Activities of user
router.route("/AllActivities").get(access_token.authenticateJWT,userController.getAllActivities);

// Make Offer
router.route("/makeoffer").post(access_token.authenticateJWT, userController.makeoffer);

//Place Bid
router.route("/placeBid").post(access_token.authenticateJWT, userController.placeBid);

//Accept Bid
router.route("/acceptBid").post(access_token.authenticateJWT, userController.acceptBid);

// Favourite NFTs
router.route("/favouriteNfts").get(access_token.authenticateJWT, userController.getFavouriteNfts).patch(access_token.authenticateJWT, userController.addFavouriteNft);

//Check Username exist or not
router.route("/checkUsername").get(access_token.authenticateJWT,userController.checkUsername);

module.exports = router;
