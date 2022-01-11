const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utilities/ExpressError");
const { campgroundScehma, reviewSchema } = require("./schemas");
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.blockedUrl = req.originalUrl
        req.flash("error", "You must be signed in to perform this action!");
        return res.redirect('/login');
    }
    else next();
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        res.redirect(`/campgrounds/${campground._id}`)
    }
    else next();
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        res.redirect(`/campgrounds/${id}`)
    }
    else next();
}

const validateCampground = (req, res, next) => {
    const { error } = campgroundScehma.validate(req.body);
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
module.exports = { isLoggedIn, isAuthor, validateCampground, validateReview, isReviewAuthor };