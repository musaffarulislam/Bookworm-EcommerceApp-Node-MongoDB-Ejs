// session user

const signupSession = (req, res, next) => {
    if (req.session.email) {
        res.redirect('/');
    } else {
        next();
    }
};


const userSession = (req, res, next) => {
    if (req.session.email) {
        res.redirect('/');
    } else {
        next();
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