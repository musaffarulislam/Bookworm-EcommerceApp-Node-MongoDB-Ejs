const { response } = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { count } = require('console');
const Razorpay = require('razorpay'); 


const user = require('../models/userModel');
const cart = require('../models/cartModel');
const coupon = require('../models/couponModel')
const order = require('../models/orderModel')
const author = require('../models/authorModel')
const book = require('../models/bookModel')
const genre = require('../models/genreModel')
const UserOTPVerification = require('../models/userOTPVerification');


const renderHome = async (req,res)=>{
  let books = await book.find({delete: {$ne: false}}).populate('author').populate('genre')
  let userId = req.session.user;
  let userDetails = false;
  if(userId){
    userDetails = await user.findOne({_id: userId})
  }
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
            bcrypt.compare(password,userdb.password).then((result)=>{
                if(result){
                    response._id=userdb._id;
                    req.session.user = response._id;
                    res.status(200).send({message:"Success",status:200})
                }else{                  
                    console.log("Incorrect Password");
                    res.status(401).send({message:"Incorrect Password",status:401})
                }
            })
          }else{
            res.status(401).send({message:"This Email Id Blocked",status:401})
          }
        }else {        
            console.log("Incorrect Email")
            res.status(401).send({message:"Incorrect Email",status:401})
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


const renderMyProfile = async (req,res) =>{
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


const renderMyOrder = async (req,res) =>{
  try{

    const warning = req.session.errormsg;
    req.session.errormsg = false;
    const userId = req.params.id;
    const userDetails = await user.findOne({_id: userId})
    const orders = await order.find({user : userId}).populate("user")
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
    }).sort({orderTime : -1});
    const count =  await order.find({user : userId}).count()
    console.log(orders);
    console.log(orders?.product);
    res.render('myOrder',{title: "my Order",userDetails,orders,count,warning});
  }catch(err){
    console.error(`Error Render myOrder page : ${err}`);
    res.redirect("/");
  }
}



const orderDelete = async (req,res) => {
  try{
    const orderId = req.query.orderId;
    await order.deleteOne({_id: orderId})
    res.status(200).send({
      data: "this is data"
    })
  }catch(err){
      console.error(`Error Product Remove : ${err}`);
      res.redirect("/");
  }
}


const renderBook = async (req,res)=>{
    let userId = req.session.user;
    let userDetails = false;
    if(userId){
      userDetails = await user.findOne({_id: userId})
    }
    let warning = req.session.errormsg;
    res.render('book',{title: 'Book',userDetails,warning});
}


const bookDetails = async (req,res)=>{
    console.log(req.params.id);
    const books = await book.findOne({_id: req.params.id}).populate('author').populate('genre');
    console.log(books);
    let userId = req.session.user;
    let userDetails = false;
    if(userId){
      userDetails = await user.findOne({_id: userId})
    }
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
    let totalAmount = productTotal(carts)
    let shipping = false;
    if(totalAmount<400){
      totalAmount = totalAmount + 40;
      shipping = true;
    }
    if(carts){
    res.render('cart',{carts,userDetails,totalAmount,shipping,count,warning});
    }else{
      res.redirect('/')
    }
  }catch(err){
    console.error(`Error Render Cart Page : ${err}`);
    res.redirect("/");
  }
}



// const addcoupon = async (req,res) => {
//     try {

//       const coupon = await coupon.findOne({ couponCode });
//       if (!coupon) {
//         return res.status(400).send({ error: "Invalid coupon code" });
//       } 

//       const currentDate = new Date();

//       if (coupon.validationDate < currentDate) {
//         return res.status(400).send({ error: "Coupan has expired" });
//       }

//       if (coupon.usedBy.includes(userId)) {
//         return res.status(400).send({ error: "You have already used this coupon" });
//       }

//       if (req.body.total < coupon.minimumTotal) {
//         return res.status(400).send({ error: "Total is below the minimum required to use this coupon" });
//       }

//       const discountPercentage = coupon.discountPercentage / 100;
//       const discountAmount = req.body.totalAmount * discountPercentage;

//       if (discountAmount > coupon.maximumDiscount) {
//         discountAmount = coupon.maximumDiscount;
//       }

//       coupon.users.push(userId);
//       await coupon.save();
      
//       return res.send({ discountAmount });
//     } catch (err) {
//       console.error(`Error applying coupon: ${err}`);
//       return res.status(500).send("Internal server error");
//     }
// }

const addToCart = async (req,res) => {
  try{
    const userId = req.query.userId;
    const productId = req.query.productId;
    // const userdb = await user.findOne({_id: userId})
    // req.session.user = userdb;

    const existingProduct = await cart.findOne({ user: userId, product: productId })
    if(existingProduct){
      await cart.findOneAndUpdate({ user: userId, product: productId },
      {$inc:{
        quantity : 1
        }
      })
      return res.redirect('/');
    } 

    const newCart = new cart({
      user : userId,
      product : productId
    });
    await newCart.save()

  }catch(err){
      console.error(`Error Add To Cart Product : ${err}`);
      res.redirect("/");
  }
}


const productDec = async (req, res) => {
  try {
    const cartId = req.query.cartId;
    const userId = req.query.userId;
    console.log(userId);
    let shipping = false;
    let quantityZero = false;

      await cart.findOneAndUpdate({ _id: cartId },
        {
          $inc: {
            quantity: -1,
          },
        }
      );

      const carts = await cart.find({ user: userId }).populate("user")
        .populate("product").populate({ path: "product", populate: { path: "author" } })
        .populate({ path: "product", populate: { path: "genre" } });

      let totalAmount = productTotal(carts);

      if (totalAmount < 400) {
        totalAmount = totalAmount + 40;
        shipping = true;
      }
      product = await cart.findOne({ _id: cartId }).populate('product');

      if(product.quantity <= 0){
        await cart.deleteOne({ _id: cartId });
        quantityZero = true;
      }

      const count = await cart.find({user: userId}).count()

      productPriceAndQuantity = parseInt(product.product.retailPrice*product.quantity)
      console.log(productPriceAndQuantity);

      res.status(200).send({
        data: "this is data",totalAmount,shipping,product,productPriceAndQuantity,quantityZero,count
      });

  } catch (err) {
    console.error(`Error Product Count Deccriment : ${err}`);
    res.redirect("/");
  }
};



const productInc = async (req,res) => {
 try {
    const cartId = req.query.cartId;
    const userId = req.query.userId;
    console.log(userId);
    let shipping = false;

      await cart.findOneAndUpdate({ _id: cartId },
        {
          $inc: {
            quantity: 1,
          },
        }
      );

      const carts = await cart.find({ user: userId }).populate("user")
        .populate("product").populate({ path: "product", populate: { path: "author" } })
        .populate({ path: "product", populate: { path: "genre" } });

      let totalAmount = productTotal(carts);

      if (totalAmount < 400) {
        totalAmount = totalAmount + 40;
        shipping = true;
      }

      product = await cart.findOne({ _id: cartId }).populate('product');

      productPriceAndQuantity = parseInt(product.product.retailPrice*product.quantity)
      console.log(productPriceAndQuantity);

      res.status(200).send({
        data: "this is data",totalAmount,shipping,product,productPriceAndQuantity,
      });
      
  } catch (err) {
    console.error(`Error Product Count Increment : ${err}`);
    res.redirect("/");
  }
}


const productRemove = async (req,res) => {
  try{
    const cartId = req.query.cartId;
    const userId = req.query.userId;
    console.log(userId);
    let shipping = false;

    const product = await cart.findOne({ _id: cartId }).populate('product');
    
    await cart.deleteOne({_id: cartId})

    const carts = await cart.find({ user: userId }).populate("user")
    .populate("product").populate({ path: "product", populate: { path: "author" } })
    .populate({ path: "product", populate: { path: "genre" } });

    let totalAmount = productTotal(carts);

    if (totalAmount < 400) {
      totalAmount = totalAmount + 40;
      shipping = true;
    }
    const count = await cart.find({user: userId}).count()
    res.status(200).send({
      data: "this is data",totalAmount,shipping,product,count,
    })
  }catch(err){
      console.error(`Error Product Remove : ${err}`);
      res.redirect("/");
  }
}


function productTotal(books){
  console.log("Product total: ",books);
  let totalPrice = 0;
  for(let i=0; i< books.length; i++){
    let book = books[i];
    totalPrice += book.product.retailPrice * book.quantity;
  }
  return totalPrice;
}


const renderCheckout = async (req,res) => {
  try{
    const warning = req.session.errormsg;
    req.session.errormsg = false;
    const userDetails = await user.findOne({_id: req.params.id})
    const carts = await cart.find({user: req.params.id}).populate('user').populate('product').
    populate({path: 'product', populate: {path: 'author'}}).populate({path: 'product', populate: {path: 'genre'}})
    const count = await cart.find({user: req.params.id}).count()
    if(!count){
      res.redirect('/');
    }
    let totalAmount = productTotal(carts)
    let shipping = false;
    if(totalAmount<400){
      totalAmount = totalAmount + 40;
      shipping = true;
    }
    if(carts){
    res.render('checkout',{carts,userDetails,totalAmount,shipping,count,warning});
    }else{
      res.redirect('/')
    }
  }catch(err){
    console.error(`Error Render Cart Page : ${err}`);
    res.redirect("/");
  }
}


const applyCoupon = async (req,res) => {
  try{
    const couponName = req.body.couponName
    console.log(couponName);

    const carts = await cart.find({user: req.body.userId}).populate('user').populate('product').
    populate({path: 'product', populate: {path: 'author'}}).populate({path: 'product', populate: {path: 'genre'}})

    const couponInfo = await coupon.findOne({ couponName });

    // const count = await cart.find({user: req.body.userId}).count()
    
    let totalAmount = productTotal(carts)
    let shipping = false;

    if(!couponName){
      if(totalAmount<400){
        totalAmount = totalAmount + 40;
        shipping = true;
      }
      return res.status(400).send({message:"Add Coupon Name",totalAmount,shipping})
    }

    if(!couponInfo){
      if(totalAmount<400){
        totalAmount = totalAmount + 40;
        shipping = true;
      }
      return res.status(400).send({message:"Coupon name not valid",totalAmount,shipping})
    }

    const currentDate = new Date();

    if (couponInfo.ExpiredDate < currentDate) {
      if(totalAmount<400){
        totalAmount = totalAmount + 40;
        shipping = true;
      }
      return res.status(400).send({ message: "Coupan has expired",totalAmount,shipping});
    }

    if (couponInfo.users.includes(req.body.userId)) {
      if(totalAmount<400){
        totalAmount = totalAmount + 40;
        shipping = true;
      }
      return res.status(400).send({ message: "You have already used this coupon",totalAmount,shipping});
    }

    if (req.body.total < couponInfo.minimumTotal) {
      if(totalAmount<400){
        totalAmount = totalAmount + 40;
        shipping = true;
      }
      return res.status(400).send({ message: "Total is below the minimum required to use this coupon",totalAmount,shipping});
    }


    let discountPercentage = couponInfo.discountPercentage / 100;
    let discountAmount = totalAmount * discountPercentage;

    if (discountAmount > couponInfo.maximumDiscountPrice) {
      discountAmount = couponInfo.maximumDiscountPrice;
    }

    let discountTotal = totalAmount - discountAmount;
    if(discountTotal<400){
      discountTotal = discountTotal + 40;
      shipping = true;
    }


    couponInfo.users.push(req.body.userId);
    // await couponInfo.save();
    res.status(200).send({message:"Coupon added",discountTotal,totalAmount,discountAmount,shipping})

  }catch(err){
    console.error(`Error Render Cart Page : ${err}`);
    res.redirect("/");
  }
}


const deleteCoupon = async (req,res) => {
  try{
    const couponName = req.body.couponName
    console.log(couponName);

    const carts = await cart.find({user: req.session.user}).populate('user').populate('product').
    populate({path: 'product', populate: {path: 'author'}}).populate({path: 'product', populate: {path: 'genre'}})

    let totalAmount = productTotal(carts)
    let shipping = false;
    if(totalAmount<400){
      totalAmount = totalAmount + 40;
      shipping = true;
    }

    res.status(200).send({message:"Coupon Remove",totalAmount,shipping})
  }catch(err){
    console.error(`Error Render Cart Page : ${err}`);
    res.redirect("/");
  }
}


const cashOnDelivary = async (req, res) => {
  try {
    const userId = req.query.userId;
    const cartItems = await cart.find({ user: userId });

    const productArray = cartItems.map(item => {
      return { productId: item.product, quantity: item.quantity };
    });

    const lastOrder = await order.find().sort({ _id: -1 }).limit(1);
    let orderId = 'BKWM000001';
    if (lastOrder.length > 0) {
      const lastOrderId = lastOrder[0].orderId;
      const orderIdNumber = parseInt(lastOrderId.slice(4));
      orderId = `BKWM${("000000" + (orderIdNumber + 1)).slice(-6)}`;
    }

    const newOrder = new order({
      orderId,
      user: userId,
      product: productArray,
      address: req.body.address,
      totalAmount: req.body.totalAmount,
      paymentMethod: "COD",
    });

    await newOrder.save();

    await cart.deleteMany({ user: userId });

    res.status(200).send({ orderId });
  } catch (err) {
    console.error(`Error Product Remove:`,err);
    res.status(500).send("Internal server error");
    res.redirect("/");
  }
};


const onlinePayment = async (req, res) => {
  try {
    const amount = req.body.totalAmount;
    const lastOrder = await order.find().sort({ _id: -1 }).limit(1);
    let orderId = 'BKWM000001';
    if (lastOrder.length > 0) {
      const lastOrderId = lastOrder[0].orderId;
      const orderIdNumber = parseInt(lastOrderId.slice(4));
      orderId = `BKWM${("000000" + (orderIdNumber + 1)).slice(-6)}`;
    }

    const razorpayInstance = new Razorpay({
      key_id: "rzp_test_ifEOe80qfCYvOK",
      key_secret: "PIw0PiNYutnX30GerxbnYZNZ"
    });

    let options = await razorpayInstance.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: orderId
    });

    console.log(options)

    const userId = req.query.userId;
    const userDetails = await user.findOne({_id: userId});

    res.status(201).json({
      success: true,
      options,
      userDetails,
      amount
    });
  } catch (err) {
    console.error(`Error Online Payment:`, err);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};


const verifyOnlinePayment = async (req, res) => {
  try {
    console.log(req.body);
    const payment = req.body.payment;
    const orderDetails = req.body.order
    let hmac = crypto.createHmac('sha256','PIw0PiNYutnX30GerxbnYZNZ')
    hmac.update(payment.razorpay_order_id +'|'+ payment.razorpay_payment_id)
    hmac=hmac.digest('hex')

    if(hmac == payment.razorpay_signature){
      const userId = req.body.userId;
      const cartItems = await cart.find({ user: userId });

      let productArray = cartItems.map(item => {
        return { productId: item.product, quantity: item.quantity };
      });

      const newOrder = new order({
        orderId : orderDetails.receipt,
        user: userId,
        product: productArray,
        address: req.body.address,
        totalAmount: orderDetails.amount/100,
        paymentMethod: "Online",
      });
  
      await newOrder.save();
  
      await cart.deleteMany({ user: userId });
  
      const orderId = orderDetails.receipt
      res.status(200).send({ orderId });
    }

  } catch (err) {
    console.error(`Error Verify Online Payment:`, err);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};




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
    renderMyProfile,
    editUser,
    address,
    addUserImage,
    renderMyOrder,
    orderDelete,
    renderBook,
    bookDetails,
    renderCart,
    addToCart,
    productDec,
    productInc,
    productRemove,
    applyCoupon,
    deleteCoupon,
    renderCheckout,
    cashOnDelivary,
    onlinePayment,
    verifyOnlinePayment,
    logout,
}