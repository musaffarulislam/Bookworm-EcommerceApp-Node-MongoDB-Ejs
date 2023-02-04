const { response } = require('express');
const fs = require('fs');
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
    let books = await book.find().populate('author').populate('genre')
    let authors = await author.find()
    let genres = await genre.find()
    res.render('admin/productManagement.ejs',{books,genres,authors});
}


const renderAddBook = async (req,res) => {
    const warning = req.session.errormsg;
    req.session.errormsg = false;
    let authors = await author.find()
    let genres = await genre.find()
    res.render('admin/addBook.ejs',{title: 'Add Book',warning,authors,genres});
}


const addBook = async(req,res) =>{
    try{

        const existingBookName = await book.findOne({ bookName: req.body.bookName });
        if (existingBookName) {
            req.session.errormsg = 'Book Already Exit';
            return res.redirect('/admin/addBook');
        }
        console.log()
      
        const newBook = new book({
            bookName : req.body.bookName,
            bookDetails : req.body.bookDetails,
            author : req.body.author,
            genre : req.body.genre,
            language : req.body.language,
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


const editBook = async (req,res) => {
    console.log(req.body.language);
    await book.updateOne({_id: req.params.id},
        {$set: 
            { 
                bookName : req.body.bookName,
                bookDetails : req.body.bookDetails,
                author : req.body.author,
                genre : req.body.genre,
                language : req.body.language,
                pages : req.body.pages,
                retailPrice : req.body.retailPrice,
                rentPrice : req.body.rentPrice,
                delete : req.body.authorDelete,
            }
        })
    res.redirect('/admin/productManagement');
}


const deleteBook = async (req,res) =>{
    await book.updateOne({_id: req.params.id},{$set: { delete: false }})
    res.redirect('/admin/productManagement');
}


const undeleteBook = async (req,res) =>{
    await book.updateOne({_id: req.params.id},{$set: { delete: true }})
    res.redirect('/admin/productManagement');
}


const addAuthorInAddBook = async (req,res) => {

    const existingAuthor = await genre.findOne({ authorName: req.body.authorName});
    if (existingAuthor) {
        req.session.errormsg = 'Author Already Exit';
        return res.redirect('/admin/addBook');
    }

    const newAuthor = new author({
        authorName : req.body.authorName,
        authorDetails : req.body.authorDetails,
        authorImage : req.file.filename,
        delete : true,
    })
    await newAuthor.save();
    res.redirect('/admin/addBook');
}


const addGenreInAddBook = async (req,res) => {

    const existingGenre = await genre.findOne({ genreName: req.body.genre });
    if (existingGenre) {
        req.session.errormsg = 'Genre Already Exit';
        return res.redirect('/admin/addBook');
    }

    const newGenre = new genre({
        genreName : req.body.genre,
        delete : true,
    })
    await newGenre.save();
    res.redirect('/admin/addBook');
}


const changeImage1 = async (req,res) => {
    await book.updateOne({_id: req.params.id},
        {$set: 
            { 
                image1 : req.file.filename,
            }
        })

        const directoryPath = "public/" + req.body.image1;

        fs.unlink(directoryPath , (err) => {
            try{
                if (err) {
                    throw err;
                }
                console.log("Delete Image 1 successfully.");
            }catch(err){
                console.error(`Error Deleting Book : ${err}`);
            }
        });
        
    res.redirect('/admin/productManagement');
}


const changeImage2 = async (req,res) => {
    await book.updateOne({_id: req.params.id},
        {$set: 
            { 
                image2 : req.file.filename,
            }
        })

        const directoryPath = "public/" + req.body.image2;

        fs.unlink(directoryPath , (err) => {
            try{
                if (err) {
                    throw err;
                }
                console.log("Delete Image 2 successfully.");
            }catch(err){
                console.error(`Error Deleting Book : ${err}`);
            }
        });

    res.redirect('/admin/productManagement');
}


const changeImage3 = async (req,res) => {
    await book.updateOne({_id: req.params.id},
        {$set: 
            { 
                image3 : req.file.filename,
            }
        })

        const directoryPath = "public/" + req.body.image3;

        fs.unlink(directoryPath , (err) => {
            try{
                if (err) {
                    throw err;
                }
                console.log("Delete Image 3 successfully.");
            }catch(err){
                console.error(`Error Deleting Book : ${err}`);
            }
        });
    res.redirect('/admin/productManagement');
}


const renderAuthorManagement = async (req,res) =>{
    let warning = req.session.errormsg;
    req.session.errormsg = false;
    let authors = await author.find()
    res.render('admin/authorManagement.ejs',{authors,warning});
}


const addAuthor = async (req,res) => {

    // const existingAuthor = await genre.findOne({ authorName: req.body.authorName});
    // if (existingAuthor) {
    //     req.session.errormsg = 'Author Already Exit';
    //     return res.redirect('/admin/authorManagement');
    // }

    const newAuthor = new author({
        authorName : req.body.authorName,
        authorDetails : req.body.authorDetails,
        authorImage : req.file.filename,
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
                authorImage : req.body.authorFile,
                delete : req.body.authorDelete,
            }
        })
    res.redirect('/admin/authorManagement');
}


const changeAuthorImage = async (req,res) => {
    await author.updateOne({_id: req.params.id},
        {$set: 
            { 
                authorName : req.body.authorName,
                authorDetails : req.body.authorDetails,
                authorImage : req.file.filename,
                delete : req.body.authorDelete,
            }
        })

        const directoryPath = "public/" + req.body.authorFile;

        fs.unlink(directoryPath , (err) => {
            try{
                if (err) {
                    throw err;
                }
                console.log("Delete Author Image successfully.");
            }catch(err){
                console.error(`Error Deleting Book : ${err}`);
            }
        });
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
    let warning = req.session.errormsg;
    req.session.errormsg = false;
    let genres = await genre.find()
    res.render('admin/genreManagement.ejs',{genres,warning});
}


const addGenre = async (req,res) => {

    const existingGenre = await genre.findOne({ genreName: req.body.genre });
    if (existingGenre) {
        req.session.errormsg = 'Genre Already Exit';
        return res.redirect('/admin/genreManagement');
    }

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
    editBook,
    deleteBook,
    undeleteBook,
    addAuthorInAddBook,
    addGenreInAddBook,
    changeImage1,
    changeImage2,
    changeImage3,
    renderAddBook,
    renderAuthorManagement,
    addAuthor,
    editAuthor,
    changeAuthorImage,
    deleteAuthor,
    undeleteAuthor,
    renderGenreManagement,
    addGenre,
    editGenre,
    deleteGenre,
    undeleteGenre,
    logout
}