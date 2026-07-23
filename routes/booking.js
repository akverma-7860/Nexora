const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// SHOW BOOKING FORM
router.get("/:id", isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    res.render("bookings/new.ejs", {
        listing,
        hideNavbar: true
    });
});

// CREATE BOOKING
router.post("/", isLoggedIn, async (req, res) => {

    const listing = await Listing.findById(req.body.listing);

    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,

        size: req.body.size,
        quantity: req.body.quantity,

        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,

        paymentMethod: req.body.paymentMethod
    });

    await booking.save();

    req.flash("success", "Order Placed Successfully 🎉");

    res.redirect("/profile");
});
module.exports = router;