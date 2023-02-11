const user = require('../models/userModel');

// session user
const signupSession = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
};


const userSession = async (req, res, next) => {
    if (req.session.user) {
        const userDetails = await user.findOne({_id: req.session.user})
        const userBlock = userDetails.block;
        if(userBlock == false){
            req.session.user = false;
            req.session.errormsg ="Email Id Blocked"
            res.redirect('/');
        }
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