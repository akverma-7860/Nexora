const Listing = require("../models/listing.js");
module.exports.renderNewForm = (req, res) => {

  res.render("listings/new.ejs", {
    simpleNavbar: true
  });

};
module.exports.showListing = async (req, res) => {

  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

const relatedListings = await Listing.aggregate([
  {
    $match: {
      _id: { $ne: listing._id } // sirf current product ko hatao
    }
  },
  {
    $sample: { size: 8 } // random 8 products
  }
]);
  res.render("listings/show.ejs", {
    listing,
    relatedListings,
  });

};
module.exports.createListing = async (req, res) => {

  if (!req.files || req.files.length === 0) {
    req.flash("error", "Image upload nahi hui!");
    return res.redirect("/listings/new");
  }

  const listingData = req.body.listing;

  const newListing = new Listing(listingData);

  newListing.owner = req.user._id;

  newListing.images = req.files.map(file => ({
    url: file.path,
    filename: file.filename,
  }));

  newListing.showOnHome = false;

  await newListing.save();

  req.flash("success", "New Listing Created");

  res.redirect("/listings");
};
  module.exports.renderEditForm=async (req, res) => {
      let { id } = req.params;
  const listing = await Listing.findById(req.params.id);
  if(!listing){
        req.flash("error", "Listing you requested for does not exist! ");
        res.redirect("/listings");
  }
let originalImageUrl = "";

if (listing.images && listing.images.length > 0) {
  originalImageUrl = listing.images[0].url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/h_300,w_250"
  );
}
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};
module.exports.updateListing = async (req, res) => {

  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Title, description, price, category update
  Object.assign(listing, req.body.listing);

  // Agar nayi images upload hui hain
  if (req.files && req.files.length > 0) {
    listing.images = req.files.map(file => ({
      url: file.path,
      filename: file.filename,
    }));
  }

  await listing.save();

  req.flash("success", "Listing Updated");

  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  const deletedListing = await Listing.findByIdAndDelete(req.params.id);

  if (deletedListing) {
    req.flash("success", "Listing Deleted ");
  }

  res.redirect("/listings");
};
module.exports.categoryListing = async (req, res) => {
  let { category } = req.params;

  // normalize (SUPER IMPORTANT)
  category = category.trim();

  const allListings = await Listing.find({
    category: { $regex: new RegExp("^" + category + "$", "i") }
  });

  console.log("CATEGORY HIT:", category);
  console.log("FOUND:", allListings.length);

  res.render("listings/category.ejs", { allListings, category });
};
module.exports.searchListings = async (req, res) => {
  let { country } = req.query;

  let query = {};

  if (country && country.trim() !== "") {
    query.country = {
      $regex: country.trim(),
      $options: "i"
    };
  }

  const allListings = await Listing.find(query);

  res.render("listings/index.ejs", {
    allListings,
    country: country || ""
  });
};
module.exports.likeListing = async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let userId = req.user._id;

  if(listing.likes.includes(userId)){
    listing.likes.pull(userId);
  } else {
    listing.likes.push(userId);
  }

  await listing.save();
  res.redirect("/listings");
};
module.exports.index = async (req, res) => {

    const allListings = await Listing.find({
      showOnHome: true
})
.sort({ createdAt: -1 })
.limit(40);
console.log("Total Listings:", allListings.length);

const featured = await Listing.find({
}).limit(8);
    const electronics = await Listing.find({
        category: { $in: ["Mobile", "Laptop"] },

    }).limit(6);

    const mens = await Listing.find({
        category: { $in: ["Shirt","T-Shirt","Jeans","Hoodie","Jacket","Track Pants"] },  

    }).limit(6);

    const womens = await Listing.find({
        category: { $in: ["Kurti","Top","Lehenga","Saree","Palazzo"] },

    }).limit(6);

    const kids = await Listing.find({
        category: "Kids Wear",

    }).limit(6);

    const fashion = await Listing.find({
        category: {
            $in: [
                "Shirt",
                "T-Shirt",
                "Jeans",
                "Kurti",
                "Top",
                "Lehenga",
                "Saree",
            ]
        },

    }).limit(6);

res.render("listings/index",{
    allListings,
    featured,
    electronics,
    mens,
    womens,
    kids,
    fashion
});
};