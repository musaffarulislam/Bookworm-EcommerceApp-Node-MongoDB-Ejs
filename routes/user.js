const { response } = require('express');
const express = require('express');
const userController = require('../conteollers/userController');
const midleware = require('../midlewares/middleware') 
const router = express.Router();

router.get('/',userController.renderHome);

router.post('/login',userController.loginVarification);

router.get('/signup',midleware.userSession,userController.renderSignup);

router.get('/otp',midleware.userSession,userController.renderOTP);

router.post('/verifyOTP',userController.verifyOTP);

router.post('/resendOTP',userController.resendOTP);

router.post('/register',userController.userSignup);

router.get('/book',userController.renderBook);

router.get('/book-details',userController.bookDetails);

router.get('/logout',userController.logout);


module.exports=router;