const Campground = require("../models/campground")

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.getNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: 'author' }).populate("author");
    if (!campground) {
        req.flash('error', "Sorry! Unless you have a time machine, this Campground doesn't exist.");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}

module.exports.getEditForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}

module.exports.updateCampground = async (req, res, next) => {
    let campground = await Campground.findById(req.params.id);
    campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true });
    req.flash('success', 'Sucessfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.makeNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Sucessfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect("/campgrounds");
}