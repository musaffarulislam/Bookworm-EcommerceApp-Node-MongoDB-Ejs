const { response } = require('express');
const express = require('express');
const adminController = require('../controllers/adminController');
const midleware = require('../midlewares/middleware');
const upload = require('../midlewares/multer')
const { get } = require('mongoose');
const router = express.Router();

router.get('/',adminController.renderLogin);

router.post('/adminLogin',adminController.adminLogin);

router.get('/admin_panel',midleware.adminSession,adminController.adminPanel);

router.get('/userManagement',midleware.adminSession,adminController.renderUserManagement);

router.get('/blockUser/:id',midleware.adminSession,adminController.blockUser);

router.get('/unblockUser/:id',midleware.adminSession,adminController.unblockUser);

router.get('/productManagement',adminController.renderProductManagement);

router.get('/addBook',adminController.renderAddBook);

// router.post('/addBook',upload.array('myFiles', 3),adminController.addBook);
router.post('/addBook',adminController.addBook);

router.post('/editBook/:id',midleware.adminSession,adminController.editBook);

router.get('/deleteBook/:id',midleware.adminSession,adminController.deleteBook);

router.get('/undeleteBook/:id',midleware.adminSession,adminController.undeleteBook);

// router.post('/addAuthorInAddBook',upload.single('authorImageAddBook'),adminController.addAuthorInAddBook);
router.post('/addAuthorInAddBook',adminController.addAuthorInAddBook);

router.post('/addGenreInAddBook',adminController.addGenreInAddBook);

router.post('/coverImage/:id',upload.single('myCover'),adminController.coverImage);

router.post('/changeImage1/:id',upload.single('myFile1'),adminController.changeImage1);

router.post('/changeImage2/:id',upload.single('myFile2'),adminController.changeImage2);

router.post('/changeImage3/:id',upload.single('myFile3'),adminController.changeImage3);

router.get('/authorManagement',midleware.adminSession,adminController.renderAuthorManagement);

router.post('/addAuthor',adminController.addAuthor);
// router.post('/addAuthor',upload.single('authorImage'),adminController.addAuthor);

router.post('/changeAuthorImage/:id',upload.single('authorImage'),adminController.changeAuthorImage);

router.post('/editAuthor/:id',adminController.editAuthor);

router.get('/deleteAuthor/:id',midleware.adminSession,adminController.deleteAuthor);

router.get('/undeleteAuthor/:id',midleware.adminSession,adminController.undeleteAuthor);

router.get('/genreManagement',midleware.adminSession,adminController.renderGenreManagement);

router.post('/addGenre',adminController.addGenre);

router.post('/editGenre/:id',adminController.editGenre);

router.get('/deleteGenre/:id',midleware.adminSession,adminController.deleteGenre);

router.get('/undeleteGenre/:id',midleware.adminSession,adminController.undeleteGenre);

router.get('/couponManagement',midleware.adminSession,adminController.renderCouponManagement);

router.post('/addCoupon',midleware.adminSession,adminController.addCoupon);

router.post('/editCoupon',midleware.adminSession,adminController.editCoupon);

router.delete('/deleteCoupon',midleware.adminSession,adminController.deleteCoupon);




// Order management

router.get('/pendingManagement',midleware.adminSession,adminController.renderPendingManagement);

router.post('/changeOnTheWayOrder/:id',midleware.adminSession,adminController.changeOnTheWayOrder);

router.get('/onthewayManagement',midleware.adminSession,adminController.renderOnTheWayManagement);

router.post('/changeCompleteOrder/:id',midleware.adminSession,adminController.changeCompleteOrder);

router.get('/completeManagement',midleware.adminSession,adminController.renderCompleteManagement);

router.post('/changeDeleteOrder/:id',midleware.adminSession,adminController.changeDeleteOrder);

router.get('/deleteManagement',midleware.adminSession,adminController.renderDeleteManagement);



// Banner Management

router.get('/bannerManagement',midleware.adminSession,adminController.renderBannerManagement);

router.post('/colorPalatte',midleware.adminSession,adminController.colorPalatte);

router.post('/mainHeading',midleware.adminSession,adminController.mainHeading);

router.post('/subHeading1',midleware.adminSession,adminController.subHeading1);

router.post('/subHeading2',midleware.adminSession,adminController.subHeading2);

router.post('/homeImage',upload.single('homeImage'),midleware.adminSession,adminController.homeImage);

router.post('/bigCard1Heading1',midleware.adminSession,adminController.bigCard1Heading1);

router.post('/bigCard1Heading2',midleware.adminSession,adminController.bigCard1Heading2);

router.post('/bigCard1Discription',midleware.adminSession,adminController.bigCard1Discription);

router.post('/bigCard1ProductId',midleware.adminSession,adminController.bigCard1ProductId);

router.post('/bigCard1Image',upload.single('bigCard1Image'),midleware.adminSession,adminController.bigCard1Image);

router.post('/bigCard2Heading1',midleware.adminSession,adminController.bigCard2Heading1);

router.post('/bigCard2Heading2',midleware.adminSession,adminController.bigCard2Heading2);

router.post('/bigCard2Discription',midleware.adminSession,adminController.bigCard2Discription);

router.post('/bigCard2ProductId',midleware.adminSession,adminController.bigCard2ProductId);

router.post('/bigCard2Image',upload.single('bigCard2Image'),midleware.adminSession,adminController.bigCard2Image);

router.post('/bottomImage1',upload.single('bottomImage1'),midleware.adminSession,adminController.bottomImage1);

router.post('/bottomImage2',upload.single('bottomImage2'),midleware.adminSession,adminController.bottomImage2);


router.get('/logout',adminController.logout);

module.exports=router;