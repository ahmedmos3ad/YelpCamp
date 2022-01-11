const Campground = require("../models/campground")
const Review = require("../models/review")

module.exports.makeNewReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Sucessfully submitted a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Sucessfully deleted a review!');
    res.redirect(`/campgrounds/${campground._id}`);
}