const { response } = require('express');
const fs = require('fs');
const user = require('../models/userModel');
const author = require('../models/authorModel')
const book = require('../models/bookModel')
const genre = require('../models/genreModel')
const coupon = require('../models/couponModel')
const order = require('../models/orderModel')


const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const session = require('express-session');
dotenv.config({path : '.env'});


const renderLogin = (req,res) =>{
    try{
        const session = req.session.adminemail;
        if(session){
            res.redirect('/admin/admin_panel');r
        }else{
            res.render('adminLogin.ejs');
        }
    }catch(err){
        console.error(`Error Get Adimn Login Page : ${err}`);
        res.redirect('/');
    }
}


const adminLogin = (req,res) =>{
    try{
        const { email, password } = req.body;
        if (email === process.env.adminEmail && password == process.env.adminPassword) {
            req.session.adminemail = req.body.email;
            res.redirect("/admin/admin_panel");
        } else {
            res.redirect("/admin");
        }
    }catch(err){
        console.error(`Error Admin Post Login : ${err}`);
        res.redirect('/admin');
    }
}


const adminPanel = (req,res) => {
    try{
        res.render('admin.ejs')
    }catch(err){
        console.error(`Error Get Admin Panel : ${err}`);
        res.redirect('/admin');
    }
}


const renderUserManagement = async (req,res) =>{
    try{
        let users = await user.find()
        res.render('admin/userManagement.ejs',{users});
    }catch(err){
        console.error(`Error Get User Management : ${err}`);
        res.redirect('/admin/admin_panel');
    }
}


const blockUser = async (req,res) =>{
    try{
        await user.updateOne({_id: req.params.id},{$set: { block: false }})
        res.redirect('/admin/userManagement');
    }catch(err){
        console.error(`Error Block User : ${err}`);
        res.redirect('/admin/userManagement');
    }
}


const unblockUser = async (req,res) =>{
    try{
        await user.updateOne({_id: req.params.id},{$set: { block: true }})
        res.redirect('/admin/userManagement');
    }catch(err){
        console.error(`Error Un Block User : ${err}`);
        res.redirect('/admin/userManagement');
    }
}



const renderProductManagement = async (req,res) =>{
    try{
        let books = await book.find().populate('author').populate('genre')
        let authors = await author.find()
        let genres = await genre.find()
        res.render('admin/productManagement.ejs',{books,genres,authors});
    }catch(err){
        console.error(`Error Get Product Management : ${err}`);
        res.redirect('/admin/admin_panel');
    }
}


const renderAddBook = async (req,res) => {
    try{
        const warning = req.session.errormsg;
        req.session.errormsg = false;
        let authors = await author.find()
        let genres = await genre.find()
        res.render('admin/addBook.ejs',{title: 'Add Book',warning,authors,genres});
    }catch(err){
        console.error(`Error Get Add Book : ${err}`);
        res.redirect('/admin/productManagement');
    }
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
            rating : req.body.rating,
            pages : req.body.pages,
            retailPrice : req.body.retailPrice,
            rentPrice : req.body.rentPrice,
            delete : true,
        }) 
        newBook.save()
        res.redirect('/admin/productManagement');

    }catch(err){
        console.error(`Error Add Book: ${err}`);
        res.redirect('/admin/productManagement');
    }
}


const editBook = async (req,res) => {
    try{
        console.log(req.body.language);
        await book.updateOne({_id: req.params.id},
            {$set: 
                { 
                    bookName : req.body.bookName,
                    bookDetails : req.body.bookDetails,
                    author : req.body.author,
                    genre : req.body.genre,
                    language : req.body.language,
                    rating : req.body.rating,
                    pages : req.body.pages,
                    retailPrice : req.body.retailPrice,
                    rentPrice : req.body.rentPrice,
                    delete : req.body.authorDelete,
                }
            })
        res.redirect('/admin/productManagement');
    }catch(err){
        console.error(`Error edit Book : ${err}`);
        res.redirect('/admin/productManagement');
    }
}


const deleteBook = async (req,res) =>{
    try{
        await book.updateOne({_id: req.params.id},{$set: { delete: false }})
        res.redirect('/admin/productManagement');
    }catch(err){
        console.error(`Error Delete Book : ${err}`);
        res.redirect('/admin/productManagement');
    }
}


const undeleteBook = async (req,res) =>{
    try{
        await book.updateOne({_id: req.params.id},{$set: { delete: true }})
        res.redirect('/admin/productManagement');
    }catch(err){
        console.error(`Error Un Delete Book : ${err}`);
        res.redirect('/admin/productManagement');
    }
}


const addAuthorInAddBook = async (req,res) => {
    try{
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
    }catch(err){
        console.error(`Error Add Book To Add Author Details : ${err}`);
        res.redirect('/admin/addBook');
    }
}


const addGenreInAddBook = async (req,res) => {
    try{
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
    }catch(err){
        console.error(`Error Add Book To Add Genere : ${err}`);
        res.redirect('/admin/addBook');
    }
}


const coverImage = async (req,res) => {
    try{
        await book.updateOne({_id: req.params.id},
            {$set: 
                { 
                    coverImage : req.file.filename,
                }
            })

            const directoryPath = "public/" + req.body.coverImage;
            fs.unlink(directoryPath , (err) => {
                try{
                    if (err) {
                        throw err;
                    }
                    console.log("Delete Cover Image successfully.");
                }catch(err){
                    console.error(`Error Deleting Book : ${err}`);
                }
            });
        res.redirect('/admin/productManagement');

    }catch(err){
        console.error(`Error Change Image 1 : ${err}`);
        res.redirect('/admin/productManagement');
    }
}

const changeImage1 = async (req,res) => {
    try{

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

    }catch(err){
        console.error(`Error Change Image 1 : ${err}`);
        res.redirect('/admin/productManagement');
    }
}


const changeImage2 = async (req,res) => {
    try{
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
    }catch(err){
        console.error(`Error Change Image 2: ${err}`);
        res.redirect('/admin/productManagement');
    }
}


const changeImage3 = async (req,res) => {
    try{
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
    }catch(err){
        console.error(`Error Change Image 3 : ${err}`);
        res.redirect('/admin/productManagement');
    }
}


const renderAuthorManagement = async (req,res) =>{
    try{
        let warning = req.session.errormsg;
        req.session.errormsg = false;
        let authors = await author.find()
        res.render('admin/authorManagement.ejs',{authors,warning});
    }catch(err){
        console.error(`Error Get Author Management : ${err}`);
        res.redirect('/admin/admin_panel');
    }
}


const addAuthor = async (req,res) => {
    try{
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
    }catch(err){
        console.error(`Error Add Author : ${err}`);
        res.redirect('/admin/authorManagement');
    }
}


const editAuthor = async (req,res) => {
    try{
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
    }catch(err){
        console.error(`Error Edit Author : ${err}`);
        res.redirect('/admin/authorManagement');
    }
}


const changeAuthorImage = async (req,res) => {
    try{
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

    }catch(err){
        console.error(`Error Change Author Image : ${err}`);
        res.redirect('/admin/authorManagement');
    }
}


const deleteAuthor = async (req,res) =>{
    try{
        await author.updateOne({_id: req.params.id},{$set: { delete: false }})
        res.redirect('/admin/authorManagement');
    }catch(err){
        console.error(`Error Delete Author : ${err}`);
        res.redirect('/admin/authorManagement');
    }
}


const undeleteAuthor = async (req,res) =>{
    try{
        await author.updateOne({_id: req.params.id},{$set: { delete: true }})
        res.redirect('/admin/authorManagement');
    }catch(err){
        console.error(`Error Un Delete Author : ${err}`);
        res.redirect('/admin/authorManagement');
    }
}


const renderGenreManagement = async (req,res) =>{
    try{
        let warning = req.session.errormsg;
        req.session.errormsg = false;
        let genres = await genre.find()
        res.render('admin/genreManagement.ejs',{genres,warning});
    }catch(err){
        console.error(`Error Get Genre Management : ${err}`);
        res.redirect('/admin/admin_panel');
    }
}


const addGenre = async (req,res) => {
    try{
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
    }catch(err){
        console.error(`Error Add Genre : ${err}`);
        res.redirect('/admin/genreManagement');
    }
}


const editGenre = async (req,res) => {
    try{
        await genre.updateOne({_id: req.params.id},
            {$set: 
                { 
                    genreName : req.body.genre,
                    delete : req.body.genreDelete,
                }
            })
        res.redirect('/admin/genreManagement');
    }catch(err){
        console.error(`Error Edit Genre : ${err}`);
        res.redirect('/admin/genreManagement');
    }
}


const deleteGenre = async (req,res) =>{
    try{
        await genre.updateOne({_id: req.params.id},{$set: { delete: false }})
        res.redirect('/admin/genreManagement');
    }catch(err){
        console.error(`Error Delete Genre : ${err}`);
        res.redirect('/admin/genreManagement');
    }
}


const undeleteGenre = async (req,res) =>{
    try{
        await genre.updateOne({_id: req.params.id},{$set: { delete: true }})
        res.redirect('/admin/genreManagement');
    }catch(err){
        console.error(`Error Un Delete Genre : ${err}`);
        res.redirect('/admin/genreManagement');
    }
}


const renderCouponManagement = async (req,res) =>{
    try{
        let warning = req.session.errormsg;
        req.session.errormsg = false;
        let coupons = await coupon.find()
        res.render('admin/couponManagement.ejs',{coupons,warning});
    }catch(err){
        console.error(`Error Get Coupon Management : ${err}`);
        res.redirect('/admin/admin_panel');
    }
}


const addCoupon = async (req,res) => {
    try{
        console.log(req.body);
        const existingCoupon = await coupon.findOne({ couponName: req.body.couponName });
        if (existingCoupon) {
            req.session.errormsg = 'Coupon Already Exit';
            return res.redirect('/admin/couponManagement');
        }

        const newCoupon = new coupon({
            couponName : req.body.couponName,
            discountPercentage : req.body.discountPercentage,
            maximumDiscountPrice : req.body.maxDiscountPrice,
            minimumTotal : req.body.minTotalAmount,
            ExpiredDate : req.body.expDate,
        })
        await newCoupon.save();
        res.redirect('/admin/couponManagement');
    }catch(err){
        console.error(`Error Add Genre : ${err}`);
        res.redirect('/admin/couponManagement');
    }
}



// Order Management

const renderPendingManagement = async (req,res) =>{
    try{
        let orders = await order.find({status: "Pending"}).populate("user")
        .populate({
          path: "product.productId",
          model: "book",
          populate: [
            {
              path: "author",
              model: "author"
            },
            {
              path: "genre",
              model: "genre"
            }
          ]
        })
        res.render('admin/orderPendingManagment.ejs',{orders});
    }catch(err){
        console.error(`Error Get Pending Management : ${err}`);
        res.redirect('/admin/admin_panel');
    }
}


const changeOnTheWayOrder = async (req,res) =>{
    try{
        await order.updateOne({_id: req.params.id},{$set: { status: "On The Way" }})
        res.redirect('/admin/pendingManagement');
    }catch(err){
        console.error(`Error change On The Way Order : ${err}`);
        res.redirect('/admin/genreManagement');
    }
}


const renderOnTheWayManagement = async (req,res) =>{
    try{
        let orders = await order.find({status: "On The Way"}).populate("user")
        .populate({
          path: "product.productId",
          model: "book",
          populate: [
            {
              path: "author",
              model: "author"
            },
            {
              path: "genre",
              model: "genre"
            }
          ]
        })
        res.render('admin/orderOnTheWayManagment.ejs',{orders});
    }catch(err){
        console.error(`Error Get Pending Management : ${err}`);
        res.redirect('/admin/admin_panel');
    }
}


const changeCompleteOrder = async (req,res) =>{
    try{
        await order.updateOne({_id: req.params.id},{$set: { status: "Complete" }})
        res.redirect('/admin/onthewayManagement');
    }catch(err){
        console.error(`Error change Complete Order : ${err}`);
        res.redirect('/admin/genreManagement');
    }
}

const renderCompleteManagement = async (req,res) =>{
    try{
        let orders = await order.find({status: "Complete"}).populate("user")
        .populate({
          path: "product.productId",
          model: "book",
          populate: [
            {
              path: "author",
              model: "author"
            },
            {
              path: "genre",
              model: "genre"
            }
          ]
        })
        res.render('admin/orderCompleteManagment.ejs',{orders});
    }catch(err){
        console.error(`Error Get Complete Management : ${err}`);
        res.redirect('/admin/admin_panel');
    }
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
    renderProductManagement,
    addBook,
    editBook,
    deleteBook,
    undeleteBook,
    addAuthorInAddBook,
    addGenreInAddBook,
    coverImage,
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
    renderCouponManagement,
    addCoupon,

    // order Management
    renderPendingManagement,
    changeOnTheWayOrder,
    renderOnTheWayManagement,
    changeCompleteOrder,
    renderCompleteManagement,

    logout,
}