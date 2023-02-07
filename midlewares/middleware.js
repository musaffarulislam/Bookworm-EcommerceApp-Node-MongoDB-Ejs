// session user

const signupSession = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
};


const userSession = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};


const adminSession = (req, res, next) => {
    if (req.session.adminemail) {
        next();
    } else {
        res.redirect('/admin');
    }
};



module.exports = {
    signupSession,
    userSession,
    adminSession
}