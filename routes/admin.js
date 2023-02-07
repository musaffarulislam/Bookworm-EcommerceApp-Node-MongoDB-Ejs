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

router.get('/blockUser/:id',midleware.adminSession,adminController.blockUser);

router.get('/unblockUser/:id',midleware.adminSession,adminController.unblockUser);

router.get('/productManagement',midleware.adminSession,adminController.renderProductManagement);

router.get('/addBook',midleware.adminSession,adminController.renderAddBook);

router.post('/addBook',upload.array('myFiles', 3),adminController.addBook);

router.post('/editBook/:id',midleware.adminSession,adminController.editBook);

router.get('/deleteBook/:id',midleware.adminSession,adminController.deleteBook);

router.get('/undeleteBook/:id',midleware.adminSession,adminController.undeleteBook);

router.post('/addAuthorInAddBook',upload.single('authorImage'),adminController.addAuthorInAddBook);

router.post('/addGenreInAddBook',adminController.addGenreInAddBook);

router.post('/changeImage1/:id',upload.single('myFile1'),adminController.changeImage1);

router.post('/changeImage2/:id',upload.single('myFile2'),adminController.changeImage2);

router.post('/changeImage3/:id',upload.single('myFile3'),adminController.changeImage3);

router.get('/authorManagement',midleware.adminSession,adminController.renderAuthorManagement);

router.post('/addAuthor',upload.single('authorImage'),adminController.addAuthor);

router.post('/changeAuthorImage/:id',upload.single('authorImage'),adminController.changeAuthorImage);

router.post('/editAuthor/:id',adminController.editAuthor);

router.get('/deleteAuthor/:id',midleware.adminSession,adminController.deleteAuthor);

router.get('/undeleteAuthor/:id',midleware.adminSession,adminController.undeleteAuthor);

router.get('/genreManagement',midleware.adminSession,adminController.renderGenreManagement);

router.post('/addGenre',adminController.addGenre);

router.post('/editGenre/:id',adminController.editGenre);

router.get('/deleteGenre/:id',midleware.adminSession,adminController.deleteGenre);

router.get('/undeleteGenre/:id',midleware.adminSession,adminController.undeleteGenre);

router.get('/logout',adminController.logout);

module.exports=router;