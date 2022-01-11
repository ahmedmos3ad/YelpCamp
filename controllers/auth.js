const User = require("../models/user");

module.exports.getRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.getLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err)
                return next(err)
        });
        req.flash('success', `Welcome to Yelp Camp, ${user.username}!`);
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.logUserIn = (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back, ${req.user.username}!`);
    const redirectURL = req.session.blockedUrl || '/campgrounds';
    delete req.session.blockedUrl;
    res.redirect(redirectURL);
}

module.exports.logUserOut = (req, res) => {
    let username = res.locals.signedUser.username;
    req.logout();
    req.flash("success", `Goodbye, ${username}!`);
    username = undefined;
    delete (username);
    res.redirect('/campgrounds');
}