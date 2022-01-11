const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.makeNewReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;