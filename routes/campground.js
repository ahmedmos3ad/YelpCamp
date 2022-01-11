const express = require('express');
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get("/", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: 'author' }).populate("author");
    if (!campground) {
        req.flash('error', "Sorry! Unless you have a time machine, this Campground doesn't exist.");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    let campground = await Campground.findById(req.params.id);
    campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true });
    req.flash('success', 'Sucessfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Sucessfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Sucessfully deleted campground!');
    res.redirect("/campgrounds");
}));

module.exports = router;