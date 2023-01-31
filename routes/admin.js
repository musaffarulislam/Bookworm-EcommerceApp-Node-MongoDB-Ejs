const { response } = require('express');
const express = require('express');
const adminController = require('../conteollers/adminController');
const midleware = require('../midlewares/middleware') 
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

router.get('/authorManagement',midleware.adminSession,adminController.renderAuthorManagement);

router.get('/addAuthor',midleware.adminSession,adminController.renderAddAuthor);

router.post('/addAuthor',adminController.storeAuthor);

router.get('/editAuthor/:id',adminController.renderEditAuthor);

router.get('/editAuthor/:id',adminController.editAuthor);

router.get('/deleteAuthor/:id',adminController.deleteAuthor);

router.get('/undeleteAuthor/:id',adminController.undeleteAuthor);

router.get('/logout',adminController.logout);

module.exports=router;