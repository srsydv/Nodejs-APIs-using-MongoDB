const express = require("express");
const userController = require("../controllers/user-profile");
const access_token = require("../services/token.services")

const   router = express.Router();

router.route("/").get(userController.getUsers).post(userController.createUser);

//edit Profile of user
router.route("/editProfile").post(access_token.authenticateJWT,userController.editProfile);

module.exports = router;
