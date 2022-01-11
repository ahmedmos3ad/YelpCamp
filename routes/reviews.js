const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");
const ExpressError = require("../utilities/ExpressError");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, message);
    } else {
        next();
    }
};

router.post("/", validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${campground._id}`);
}))

module.exports = router;