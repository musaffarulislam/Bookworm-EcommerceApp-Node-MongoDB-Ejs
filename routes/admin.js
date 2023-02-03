const { response } = require('express');
const express = require('express');
const adminController = require('../conteollers/adminController');
const midleware = require('../midlewares/middleware');
const upload = require('../midlewares/multer')
const { get } = require('mongoose');
const router = express.Router();


router.get('/',adminController.renderLogin);

router.post('/adminLogin',adminController.adminLogin);

router.get('/admin_panel',midleware.adminSession,adminController.adminPanel);

router.get('/userManagement',midleware.adminSession,adminController.renderUserManagement);

router.get('/blockUser/:id',adminController.blockUser);

router.get('/unblockUser/:id',adminController.unblockUser);

router.get('/deleteUser/:id',adminController.deleteUser);

router.get('/productManagement',midleware.adminSession,adminController.renderProductManagement);

router.get('/addBook',midleware.adminSession,adminController.renderAddBook);

router.post('/addBook',upload.array('myFiles', 3),adminController.addBook);

router.post('/changeImage1/:id',upload.single('myFile1'),adminController.changeImage1);

router.post('/changeImage2/:id',upload.single('myFile2'),adminController.changeImage2);

router.post('/changeImage3/:id',upload.single('myFile3'),adminController.changeImage3);

router.get('/authorManagement',midleware.adminSession,adminController.renderAuthorManagement);

router.post('/addAuthor',adminController.addAuthor);

router.post('/editAuthor/:id',adminController.editAuthor);

router.get('/deleteAuthor/:id',adminController.deleteAuthor);

router.get('/undeleteAuthor/:id',adminController.undeleteAuthor);

router.get('/genreManagement',midleware.adminSession,adminController.renderGenreManagement);

router.post('/addGenre',adminController.addGenre);

router.post('/editGenre/:id',adminController.editGenre);

router.get('/deleteGenre/:id',adminController.deleteGenre);

router.get('/undeleteGenre/:id',adminController.undeleteGenre);

router.get('/logout',adminController.logout);

module.exports=router;