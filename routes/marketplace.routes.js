const express = require("express");
const NFTmarketplace = require("../controllers/marketplace.controllers");
const access_token = require("../services/token.services")
const ValidatorModel = require("../models/Validator-profile");
const nftForValidation = require("../models/NftForValidation")
const NftprofiledetailModel = require("../models/Nftprofiledetail")
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();


// List Your NFT from MarketPlace
router.route("/listNFTforMP").put(access_token.authenticateJWT, NFTmarketplace.listNFTforMP);

//UnList your NFT from MarketPlace
router.route("/unlistNFTforMP").put(access_token.authenticateJWT, NFTmarketplace.unlistNFTforMP);

// Pagiantion of NFT for MarketPlace
router.route("/MarketPlaceNFTs").get(NFTmarketplace.MarketPlaceNFTs);

// NFTs for swap for MarketPlace
router.route("/NFTsForSwap").get(NFTmarketplace.NFTsForSwap);

// Place Bid
// router.route("/placeBid").put(access_token.authenticateJWT, NFTmarketplace.placeBid);



module.exports = router;