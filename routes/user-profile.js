const express = require("express");
const { getUsers, createUser } = require("../controllers/user-profile");

const router = express.Router();

router.route("/").get(getUsers).post(createUser);

module.exports = router;
