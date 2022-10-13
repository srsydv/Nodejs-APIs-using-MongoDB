const express = require("express");
const { getValidators, createValidator } = require("../controllers/validator-profile");

const router = express.Router();

router.route("/").get(getValidators).post(createValidator);

module.exports = router;
