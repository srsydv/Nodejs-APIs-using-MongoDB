const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

//User Login
router.route("/login").post(authController.Authlogin);

//validatorlogin
router.route("/validatorlogin").post(authController.validatorlogin);

module.exports = router;
