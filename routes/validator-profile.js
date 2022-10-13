const express = require("express");
const validatorController = require("../controllers/validator-profile");
const access_token = require("../services/token.services")
const ValidatorModel = require("../models/Validator-profile");
const nftForValidation = require("../models/NftForValidation")
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/").get(validatorController.getValidators).post(validatorController.createValidator);

//validator login as User
router.route("/validatorloginAsUser").post(validatorController.validatorloginAsUser);

//edit profile of Validator
router.route("/EditvalidatorProfile").put(access_token.authenticateJWT,validatorController.EditvalidatorProfile);

// All Validators Profile
router.route("/validatorsProfile").get(access_token.authenticateJWT,advancedResults(ValidatorModel),validatorController.validatorsProfile);

// All Requests for Validation for validator
router.route("/RequestforValidation").get(access_token.authenticateJWT,advancedResults(nftForValidation),validatorController.RequestforValidation);

//Validate NFT by Validator
router.route("/validateNFT").put(access_token.authenticateJWT,validatorController.validateNFT);

module.exports = router;
