const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.renderBookingForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("bookings/new.ejs", {
        listing,
        hideNavbar: true
    });
};
module.exports.createBooking = async (req, res) => {

    const listing = await Listing.findById(req.body.listing);

    if (!listing) {
        req.flash("error", "Product not found!");
        return res.redirect("/listings");
    }

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
};