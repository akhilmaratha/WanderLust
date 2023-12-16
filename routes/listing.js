const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const multer  = require('multer');
const {storage}= require("../cloudConfig.js")
const upload = multer({ storage })

const {
  isLoggedIn,
  isOwner, validateListing,
} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
//Router.Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
   upload.single("listing[image]"),
  validateListing,
 
  wrapAsync(listingController.createListing)
)
// .post(upload.single("listing[image]"),(req,res)=>{
//   res.send(req.file);
// })
//New Route
router.get("/new", isLoggedIn,(listingController.renderNewForm));

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.delete(isLoggedIn, listingController.destroyListing)
.put( isLoggedIn, isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing));



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;
