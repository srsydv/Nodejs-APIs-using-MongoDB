const express = require("express");
const validatorController = require("../controllers/validator-profile");
const access_token = require("../services/token.services")
const ValidatorModel = require("../models/Validator-profile");
const nftForValidation = require("../models/NftForValidation")
const NftprofiledetailModel = require("../models/Nftprofiledetail")
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/").get(validatorController.getValidators).post(validatorController.createValidator);

//validator login as User
router.route("/validatorloginAsUser").post(validatorController.validatorloginAsUser);

//edit profile of Validator
router.route("/EditvalidatorProfile").put(access_token.authenticateJWT, validatorController.EditvalidatorProfile);

// All Validators Profile
router.route("/validatorsProfile").get(access_token.authenticateJWT, advancedResults(ValidatorModel), validatorController.validatorsProfile);

// All Requests for Validation for validator
router.route("/RequestforValidation").get(access_token.authenticateJWT,  validatorController.RequestforValidation);

//Validate NFT by Validator
router.route("/validateNFT").put(access_token.authenticateJWT, validatorController.validateNFT);

// Validator's validated NFTs
router.route("/validatedNFTs").get(access_token.authenticateJWT, validatorController.MyValidatedNFT);

//Accept redeem request by validator
router.route("/acceptRedeemReq").post(access_token.authenticateJWT, validatorController.acceptRedeemReq);

// Activity for Validator
router.route("/AllActivitiesofValidator").get(access_token.authenticateJWT,validatorController.getAllActivities);

// Favourite NFTs
router.route("/favouriteNfts").get(access_token.authenticateJWT, validatorController.getFavouriteNfts).patch(access_token.authenticateJWT, validatorController.addFavouriteNft);

//Read The Notification By Validator
router.route("/ReadTheNotification").post(access_token.authenticateJWT, validatorController.ReadTheNotification);

module.exports = router;
