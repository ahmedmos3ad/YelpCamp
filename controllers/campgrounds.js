const Campground = require("../models/campground")
const { cloudinary } = require('../cloudinary')

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
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true });
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages)
            await cloudinary.uploader.destroy(filename)
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Sucessfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.makeNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campground.author = req.user._id;
    await campground.save();
    //console.log(req.files)
    //console.log(campground);
    req.flash('success', 'Sucessfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect("/campgrounds");
}