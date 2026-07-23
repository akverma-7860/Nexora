const User = require("../models/user.js");
const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs", {
        hideNavbar: true
    });
}

module.exports.signup = async (req, res, next) => {
try{
let { username, email, password, profileImage } = req.body;
const newUser = new User({
  email,
  username,
  profileImage
});const registerUser=await User.register(newUser,password);
console.log(registerUser);
req.login(registerUser,(err) =>{
     if(err) {
            return next(err);

        }
req.flash("success","Welcome to ClickKart");
res.redirect("/listings");


});


    }catch(e){
req.flash("error",e.message);
res.redirect("/signup");
    }

};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs", {
        hideNavbar: true
    });
}
module.exports.login=async(req, res) => {
req.flash("success", "Welcome Back To ClickKart!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };
  module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};
module.exports.profile = async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id
    }).populate("listing");

    const likedListings = await Listing.find({
        likes: req.user._id
    });

    res.render("users/profile.ejs", {
        currUser: req.user,
        bookings,
        likedListings,
        simpleNavbar: true
    });

};