const { response } = require('express');
const user = require('../models/userModel');
const author = require('../models/authorModel')
const book = require('../models/bookModel')
const genre = require('../models/genreModel')


const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const session = require('express-session');
dotenv.config({path : '.env'});


const renderLogin = (req,res) =>{
    const session = req.session.adminemail;
    if(session){
        res.redirect('/admin/admin_panel');
    }else{
        res.render('adminLogin.ejs');
    }
}

const adminLogin = (req,res) =>{
    const { email, password } = req.body;
    if (email === process.env.adminEmail && password == process.env.adminPassword) {
        req.session.adminemail = req.body.email;
        res.redirect("/admin/admin_panel");
    } else {
        res.redirect("/admin");
    }
}

const adminPanel = (req,res) => {
    res.render('admin.ejs')
}

const renderUserManagement = async (req,res) =>{
    let users = await user.find({}).cursor().toArray()
    // console.log(users)
    res.render('admin/userManagement.ejs',{users});
}

const blockUser = async (req,res) =>{
    await user.updateOne({_id: req.params.id},{$set: { block: false }})
    res.redirect('/admin/userManagement');
}

const unblockUser = async (req,res) =>{
    await user.updateOne({_id: req.params.id},{$set: { block: true }})
    res.redirect('/admin/userManagement');
}

const deleteUser = async (req,res) =>{
    await user.deleteOne({_id: req.params.id})
    res.redirect('/admin/userManagement');
}


const renderProductManagement = async (req,res) =>{
    let users = await user.find()
    res.render('admin/productManagement.ejs',{users});
}

const renderAddBook = async (req,res) => {
    const warning = false
    let authors = await author.find()
    let genres = await genre.find()
    res.render('admin/addBook.ejs',{title: 'Add Book',warning,authors,genres});
}


const addBook = async(req,res) =>{
    try{
        const newBook = new book({
            bookName : req.body.bookName,
            bookDetails : req.body.bookDetails,
            author : req.body.author,
            genre : req.body.genre,
            image1 : req.files[0].filename,
            image2 : req.files[1].filename,
            image3 : req.files[2].filename,
            pages : req.body.pages,
            retailPrice : req.body.retailPrice,
            rentPrice : req.body.rentPrice,
            delete : true,
        }) 
        newBook.save()

        res.redirect('/admin/productManagement');
    }catch(err){
        console.error(`Error Adding Book : ${err}`);
    }
}

const renderAuthorManagement = async (req,res) =>{
    let authors = await author.find({}).cursor().toArray()
    res.render('admin/authorManagement.ejs',{authors});
}


const addAuthor = async (req,res) => {
    const newAuthor = new author({
        authorName : req.body.authorName,
        authorDetails : req.body.authorDetails,
        delete : true,
    })
    await newAuthor.save();
    res.redirect('/admin/authorManagement');
}


const editAuthor = async (req,res) => {
    await author.updateOne({_id: req.params.id},
        {$set: 
            { 
                authorName : req.body.authorName,
                authorDetails : req.body.authorDetails,
                delete : req.body.authorDelete,
            }
        })
    res.redirect('/admin/authorManagement');
}

const deleteAuthor = async (req,res) =>{
    await author.updateOne({_id: req.params.id},{$set: { delete: false }})
    res.redirect('/admin/authorManagement');
}

const undeleteAuthor = async (req,res) =>{
    await author.updateOne({_id: req.params.id},{$set: { delete: true }})
    res.redirect('/admin/authorManagement');
}

const renderGenreManagement = async (req,res) =>{
    let genres = await genre.find()
    res.render('admin/genreManagement.ejs',{genres});
}

const addGenre = async (req,res) => {
    const newGenre = new genre({
        genreName : req.body.genre,
        delete : true,
    })
    await newGenre.save();
    res.redirect('/admin/genreManagement');
}

const editGenre = async (req,res) => {
    await genre.updateOne({_id: req.params.id},
        {$set: 
            { 
                genreName : req.body.genre,
                delete : req.body.genreDelete,
            }
        })
    res.redirect('/admin/genreManagement');
}

const deleteGenre = async (req,res) =>{
    await genre.updateOne({_id: req.params.id},{$set: { delete: false }})
    res.redirect('/admin/genreManagement');
}

const undeleteGenre = async (req,res) =>{
    await genre.updateOne({_id: req.params.id},{$set: { delete: true }})
    res.redirect('/admin/genreManagement');
}

const logout = (req,res)=>{
    req.session.adminemail = null;
    res.redirect("/admin");
}

module.exports = {
    renderLogin,
    adminLogin,
    adminPanel,
    renderUserManagement,
    blockUser,
    unblockUser,
    deleteUser,
    renderProductManagement,
    addBook,
    renderAddBook,
    renderAuthorManagement,
    addAuthor,
    editAuthor,
    deleteAuthor,
    undeleteAuthor,
    renderGenreManagement,
    addGenre,
    editGenre,
    deleteGenre,
    undeleteGenre,
    logout
}