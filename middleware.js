const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.blockedUrl = req.originalUrl
        req.flash("error", "you must be signed in to create a new campground");
        return res.redirect('/login');
    }
    else next();
}

module.exports = isLoggedIn;