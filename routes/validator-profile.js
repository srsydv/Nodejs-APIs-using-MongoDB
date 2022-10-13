const express = require("express");
const validatorController = require("../controllers/validator-profile");
const access_token = require("../services/token.services")

const router = express.Router();

router.route("/").get(validatorController.getValidators).post(validatorController.createValidator);

//validator login as User
router.route("/validatorloginAsUser").post(validatorController.validatorloginAsUser);

//edit profile of Validator
router.route("/EditvalidatorProfile").put(access_token.authenticateJWT,validatorController.EditvalidatorProfile);

module.exports = router;
