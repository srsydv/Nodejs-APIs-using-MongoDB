const express = require("express");
const { getNfts, createNft } = require("../controllers/nftForValidation");

const router = express.Router();

router.route("/").get(getNfts).post(createNft);

module.exports = router;
