const { response } = require('express');
const express = require('express');
const userController = require('../conteollers/userController');
const midleware = require('../midlewares/middleware') 
const upload = require('../midlewares/multer')
const router = express.Router();


router.get('/',userController.renderHome);

router.post('/login',userController.loginVarification);

router.get('/signup',midleware.signupSession,userController.renderSignup);

router.get('/otp',midleware.signupSession,userController.renderOTP);

router.post('/verifyOTP',userController.verifyOTP);

router.post('/resendOTP',userController.resendOTP);

router.post('/register',userController.userSignup);

router.get('/myProfile/:id',midleware.userSession,userController.renderMyProfile);

router.get('/myOrder/:id',midleware.userSession,userController.renderMyOrder);

router.post('/orderDelete',userController.orderDelete);

router.post('/editUser/:id',userController.editUser);

router.post('/address/:id',userController.address);

router.post('/addUserImage/:id',upload.single('userImage'),userController.addUserImage);

router.get('/book',userController.renderBook);

router.get('/book-details/:id',userController.bookDetails);

router.get('/cart/:id',midleware.userSession,userController.renderCart);

router.post('/addToCart',userController.addToCart);

router.post('/productDec',userController.productDec);

router.post('/productInc',userController.productInc);

router.post('/productRemove',userController.productRemove);

router.get('/checkout/:id',midleware.userSession,userController.renderCheckout);

router.post('/cashOnDelivary',userController.cashOnDelivary);

router.post('/onlinePayment',userController.onlinePayment);

router.post('/verifyOnlinePayment',userController.verifyOnlinePayment);

router.get('/logout',userController.logout);


module.exports=router;