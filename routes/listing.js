const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ListingController = require("../controllers/listings.js");
const Listing = require("../models/listing");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

router.get(
  "/search",
  wrapAsync(ListingController.searchListings)
);

// INDEX + CREATE
router.route("/")
.get(wrapAsync(ListingController.index))
.post(
  isLoggedIn,
  (req, res, next) => {
    if (req.user.username !== "rvd") {
      req.flash("error", "Only Seller can add products!");
      return res.redirect("/listings");
    }
    next();
  },
  validateListing,
upload.array("listing[images]", 5),
  wrapAsync(ListingController.createListing)
);

// NEW FORM
router.get(
  "/new",
  isLoggedIn,
  (req, res, next) => {
    if (req.user.username !== "rvd") {
      req.flash("error", "Only Seller can add products!");
      return res.redirect("/listings");
    }
    next();
  },
  ListingController.renderNewForm
);
// CATEGORY ROUTE
router.get(
  "/category/:category",
  wrapAsync(ListingController.categoryListing)
);

// ❤️ LIKED LISTINGS ROUTE
router.get("/liked", isLoggedIn, async (req, res) => {
  const allListings = await Listing.find({
    likes: req.user._id
  });

  res.render("listings/liked.ejs", { allListings });
});

// SHOW + UPDATE + DELETE
router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(
  isLoggedIn,
  isOwner,
upload.array("listing[images]", 5),
  validateListing,
  wrapAsync(ListingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.destroyListing)
);

// EDIT FORM
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);

// ❤️ LIKE ROUTE
router.post(
  "/:id/like",
  isLoggedIn,
  wrapAsync(ListingController.likeListing)
);

module.exports = router;