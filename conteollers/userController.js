const { response } = require('express');
const fs = require('fs');
const user = require('../models/userModel');
const cart = require('../models/cartModel')
const author = require('../models/authorModel')
const book = require('../models/bookModel')
const genre = require('../models/genreModel')
const UserOTPVerification = require('../models/userOTPVerification');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');



const renderHome = async (req,res)=>{
    let books = await book.find({delete: {$ne: false}}).populate('author').populate('genre')
    console.log(books);
    let userDetails = req.session.user;
    let warning = req.session.errormsg;
    req.session.errormsg = false;
    res.render('index',{ title: "Home",books,userDetails,warning});
}

const loginVarification = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userdb = await user.findOne({ email: email});

        if(userdb) {
          if(userdb.block){
            bcrypt.compare(password,userdb.password).then((status)=>{
                if(status){
                    response.username=userdb;
                    req.session.user = response.username;
                    console.log("Login success")
                    res.redirect('/');
                }else{
                    req.session.errormsg = "Incorrect Password";
                    res.redirect('/');
                }
            })
          }else{
            req.session.errormsg = "Email Id Blocked";
            res.redirect('/');
          }
        }else {
            req.session.errormsg = "Incorrect Email Id";
            res.redirect('/')
        }
      }catch(err){
        console.error(`Error Login Varification : ${err}`);
        res.redirect('/');
    }
}

const renderSignup = (req,res)=>{
  let warning = req.session.errormsg;
  req.session.errormsg = false;
  res.render('signup',{title: 'Signup',warning});
}


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'bookworm.ecommerce.project@gmail.com',
      pass: 'vbkxsqzybfuaaylt'
    }
});
   
const userSignup = async (req, res) => {
    try {
        const existingUser = await user.findOne({ email: req.body.email });
    
        if (existingUser) {
          req.session.errormsg = 'Email already exists';
          return res.redirect('/signup');
        }
    
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const User = {
            username: req.body.userName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            age: req.body.age,
            password: hashedPassword,
            block: true,
        };


        const OTP = Math.floor(1000 + Math.random() * 9000).toString();
        const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

        console.log(OTP);
    
        await UserOTPVerification.deleteMany({email: User.email})

        const newOTPVerification = new UserOTPVerification({
          email: User.email,
          otp: OTP,
          expiresAt: expirationTime
        });
        await newOTPVerification.save();

        const mailOptions = {
          from: 'bookworm.ecommerce.project@gmail.com',
          to: User.email,
          subject: 'OTP',
          text: `You otp :${OTP}`,
          html: `
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Bookworm</a>
          </div>
          <p style="font-size:1.1em">Hi ${User.username},</p>
          <p>Thank you for choosing Brandworm. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
          <p style="font-size:0.9em;">Regards,<br />Bookworm</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Bookworm</p>
          </div>
          </div>
          </div>`
        };
    
        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`Error sending email: ${error}`);
          }
          console.log(`OTP sent to ${User.email}: ${OTP}`);
          res.redirect(`/otp?userName=${User.username}&email=${User.email}&phoneNumber=${User.phoneNumber}&age=${User.age}&password=${User.password}&block=${User.block}&expiresAt=${expirationTime}`);
        });
      }catch(err){
        console.error(`Error User Signup: ${err}`);
        res.redirect('/signup');
    }
};
  

const renderOTP = (req,res) => {
    const userInfo = req.query;
    warning = false;
    res.render('otp',{title: 'Otp',userInfo})
}


const verifyOTP = async (req,res)=> {
    try{
        const userOtp = await UserOTPVerification.findOne({email : req.body.email});
        const userInfo = {
          userName: req.body.userName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          age: req.body.age,
          password: req.body.password,
          expiresAt : req.body.expirationTime,
          block: true,
        };
        if(req.body.otp == userOtp.otp){
          let date = new Date(Date.now());
          if(date < userOtp.expiresAt){
            const newUser = new user({
                username: req.body.userName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                age: req.body.age,
                password: req.body.password,
                block: true,
            });

            await newUser.save();
            await UserOTPVerification.deleteOne({email : req.body.email});

            const userdb = await user.findOne({ email: req.body.email});
            response.username=userdb;
            req.session.user = response.username;

            res.redirect("/");
          }else{
              req.session.errormsg = "OTP Expired";
              warning = req.session.errormsg;
              req.session.errormsg = false;
              res.render('otp',{title: 'Otp',warning,userInfo});
          }
        }else{
            req.session.errormsg = "Invalid Otp";
            warning = req.session.errormsg;
            req.session.errormsg = false;
            res.render('otp',{title: 'Otp',warning,userInfo});
        }
      }catch(err){
        console.error(`Error Add Genre : ${err}`);
        res.redirect('/');
    }
}


const resendOTP = async (req,res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const User = {
            username: req.body.userName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            age: req.body.age,
            password: hashedPassword,
            block: true,
        };

        const OTP = Math.floor(1000 + Math.random() * 9000).toString();
        console.log(OTP);
        const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
    
        await UserOTPVerification.deleteMany({email: User.email})

        const newOTPVerification = new UserOTPVerification({
          email: User.email,
          otp: OTP,
          expiresAt: expirationTime
        });
    
        await newOTPVerification.save();
    
        const mailOptions = {
          from: 'bookworm.ecommerce.project@gmail.com',
          to: User.email,
          subject: 'Resend OTP',
          text: `You otp : ${OTP}`,
          html: `
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Bookworm</a>
          </div>
          <p style="font-size:1.1em">Hi ${User.username},</p>
          <p>Thank you for choosing Brandworm. Use the following Resend OTP to complete your Sign Up procedures. Resend OTP is valid for 5 minutes</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
          <p style="font-size:0.9em;">Regards,<br />Bookworm</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Bookworm </p>
          </div>
          </div>
          </div>`
        };
    
        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`Error sending email: ${error}`);
          }
          console.log(`OTP sent to ${User.email}: ${OTP}`);
          res.redirect(`/otp?userName=${User.username}&email=${User.email}&phoneNumber=${User.phoneNumber}&age=${User.age}&password=${User.password}&block=${User.block}&expiresAt=${expirationTime}`);
        });
    }catch(err){
        console.error(`Error Resend OTP : ${err}`);
        res.redirect('/signup');
    }
}


const userProfile = async (req,res) =>{
  const warning = req.session.errormsg;
  req.session.errormsg = false;
  const userId = req.params.id;
  const userDetails = await user.findOne({_id: userId})
  res.render('userProfile',{ title: "User Profile",userDetails,warning});
}


const editUser = async (req,res) =>{
  try{
    await user.updateOne({_id: req.params.id},
      {$set:
        {
          username: req.body.userName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          age: req.body.age,
        }
      })
      res.redirect(`/userProfile/${req.params.id}`);
  }catch(err){
    console.error(`Error Edit User Info : ${err}`);
    res.redirect(`/userProfile/${req.params.id}`);
  }
}


const address = async (req,res) =>{
  try{
    await user.updateOne({_id: req.params.id},
      {$set:
        {
          address:{
            houseName: req.body.houseName,
            streetName: req.body.streetName,
            town: req.body.town,
            state: req.body.state,
            country: req.body.country,
            zipCode: req.body.zipCode
          }
        }
      })
      res.redirect(`/userProfile/${req.params.id}`);
  }catch(err){
    console.error(`Error Edit User Info : ${err}`);
    res.redirect(`/userProfile/${req.params.id}`);
  }
}

const addUserImage = async (req,res) =>{
  console.log("add user working ");
  try{
    await user.findOneAndUpdate({_id: req.params.id},
      {$set: 
          { 
              userImage : req.file.filename,
          }
      });

      const directoryPath = "public/" + req.body.userImageLocation;
      fs.unlink(directoryPath , (err) => {
          try{
              if (err) {
                  throw err;
              }
              console.log("Delete User Name successfully.");
          }catch(err){
              console.error(`Error Deleting Book : ${err}`);
          }
      });
      res.redirect(`/userProfile/${req.params.id}`);

  }catch(err){
      console.error(`Error Add User Image : ${err}`);
      res.redirect(`/userProfile/${req.params.id}`);
  }
}

const renderBook = (req,res)=>{
    let userDetails = req.session.user;
    let warning = req.session.errormsg;
    res.render('book',{title: 'Book',userDetails,warning});
}

const bookDetails = async (req,res)=>{
    console.log(req.params.id);
    const books = await book.findOne({_id: req.params.id}).populate('author').populate('genre');
    console.log(books);
    let userDetails = req.session.user;
    let warning = req.session.errormsg;
    req.session.errormsg = false;
    res.render('book-detail',{title: 'Bookdetails',books,userDetails,warning});
}


const renderCart = async (req,res) => {
  try{
    const warning = req.session.errormsg;
    req.session.errormsg = false;
    const userDetails = await user.findOne({_id: req.params.id})
    const carts = await cart.find({user: req.params.id}).populate('user').populate('product').
    populate({path: 'product', populate: {path: 'author'}}).populate({path: 'product', populate: {path: 'genre'}})
    const count = await cart.find({user: req.params.id}).count()
    const totalAmount = productTotal(carts)
    if(carts){
    res.render('cart',{carts,userDetails,totalAmount,count,warning});
    }else{
      res.redirect('/')
    }
  }catch(err){
    console.error(`Error Render Cart Page : ${err}`);
    res.redirect("/");
  }
}

function productTotal(books){
  let totalPrice = 0;
  for(let i=0; i< books.length; i++){
    let book = books[i];
    totalPrice += book.product.retailPrice * book.quantity;
  }
  if(totalPrice>400){
    return totalPrice;
  }else{
    shippinTotalPrice = totalPrice + 40;
    return shippinTotalPrice;
  }
}


const addToCart = async (req,res) => {
  try{
    const userId = req.query.userId;
    const productId = req.query.productId;
    const userdb = await user.findOne({_id: userId})
    req.session.user = userdb;


    console.log(userId);
    console.log(productId);

    const existingProduct = await cart.findOne({ user: userId, product: productId })
    console.log(existingProduct);
    if(existingProduct){
      await cart.findOneAndUpdate({ user: userId, product: productId },
      {$inc:{
        quantity : 1
        }
      })
      return res.redirect('/');
    } 

    console.log("Add To cart");
    const newCart = new cart({
      user : userId,
      product : productId
    });
    await newCart.save()
    res.redirect("/");

  }catch(err){
      console.error(`Error Add To Cart Product : ${err}`);
      res.redirect("/");
  }
}

const logout = (req,res)=>{
  req.session.user = null;
  res.redirect("/");
}



module.exports = {
    renderHome,
    loginVarification,
    userSignup,
    renderSignup,
    renderOTP,
    verifyOTP,
    resendOTP,
    userProfile,
    editUser,
    address,
    addUserImage,
    renderBook,
    bookDetails,
    renderCart,
    addToCart,
    logout,
}