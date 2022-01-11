const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");
const joi = require("joi");
const { campgroundScehma, reviewSchema } = require("./schemas");
const Review = require("./models/review");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.engine("ejs", ejsMate);

const validateCampground = (req, res, next) => {
  const {
    error
  } = campgroundScehma.validate(req.body);
  if (error) {
    //the destructured error.details is an array of objects
    //we need to map over the objects within the array
    //and turn it into a single string and join it together
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, message);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, message);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", catchAsync(async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id).populate("reviews");
  res.render("campgrounds/show", { campground });
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
}));

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res, next) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true });
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete("/campgrounds/:id", catchAsync(async (req, res, next) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
}));

app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen("3000", () => {
  console.log("Listening on port 3000...");
});