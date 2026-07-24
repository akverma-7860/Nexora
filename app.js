if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");  
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter =require("./routes/listing.js");
const reviewRouter =require("./routes/review.js");
const userRouter =require("./routes/user.js");

const bookingRouter = require("./routes/booking.js");
let MONGO_URL;

if (process.env.NODE_ENV === "production") {
  MONGO_URL = process.env.MONGO_URI;
} else {
  MONGO_URL = "mongodb://127.0.0.1:27017/cars";
}
// DB connect
main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// MIDDLEWARE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret:"mysupersecretstring",resave:false, saveUninitialized:true,
  cookie:{expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
  };


//   // ROOT
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  // Current route EJS ko bhejo
  res.locals.currRoute = req.originalUrl;
res.locals.simpleNavbar = false;
  next();
});
app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student"
   });

   let registeredUser = await User.register(fakeUser, "helloworld");
   res.send(registeredUser);
});
// =======================
// LISTING ROUTES


// ==============res,next=========

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);
app.use("/bookings", bookingRouter);

// =======================
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
});
app.use((err,req,res,next)=>{
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs",{message});
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});