const express = require("express");
const NFTmarketplace = require("../controllers/marketplace.controllers");
const access_token = require("../services/token.services")
const ValidatorModel = require("../models/Validator-profile");
const nftForValidation = require("../models/NftForValidation")
const NftprofiledetailModel = require("../models/Nftprofiledetail")
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();


// List Your NFT for MarketPlace
router.route("/listNFTforMP").put(access_token.authenticateJWT, NFTmarketplace.listNFTforMP);

// Pagiantion of NFT for MarketPlace
router.route("/MarketPlaceNFTs").get(NFTmarketplace.MarketPlaceNFTs);



module.exports = router;