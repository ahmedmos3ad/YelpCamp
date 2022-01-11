const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");


router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Sucessfully submitted a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Sucessfully deleted a review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

module.exports = router;