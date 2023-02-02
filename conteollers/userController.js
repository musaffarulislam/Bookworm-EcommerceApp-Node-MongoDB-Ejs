const { response } = require('express');
const user = require('../models/userModel');
const UserOTPVerification = require('../models/userOTPVerification');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');



const renderHome = (req,res)=>{
    let session = req.session.email;
    let warning = req.session.errormsg;
    req.session.errormsg = false;
    res.render('index',{ title: "Home",session,warning});
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
                    response.email=userdb;
                    req.session.email = response.email;
                    console.log(req.session.email)
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
        console.log("err");
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


const randomOTP = Math.floor(1000 + Math.random() * 9000).toString()
   
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


        const OTP = randomOTP;
        const expirationTime = Date.now() + 5 * 60 * 1000;

        console.log(OTP);
    
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
          res.redirect(`/otp?userName=${User.username}&email=${User.email}&phoneNumber=${User.phoneNumber}&age=${User.age}&password=${User.password}&block=${User.block}`);
        });
      } catch (err) {
        console.error(`Error inserting user: ${err}`);
      }
};
  

const renderOTP = (req,res) => {
    const userInfo = req.query
    console.log(userInfo);
    res.render('otp',{title: 'Otp',userInfo})
}


const verifyOTP = async (req,res)=> {
    try{
        const userOtp = await UserOTPVerification.findOne({email : req.body.email});
        if(req.body.otp == userOtp.otp){
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

            res.redirect("/");
        }else{
            const userInfo = {
                username: req.body.userName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                age: req.body.age,
                password: req.body.password,
                block: true,
            };
            res.render('otp',{title: 'Otp',invalid:"Invalid OTP",userInfo});
        }
    }catch(error){
        console.log(error);
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

        const OTP = randomOTP;
        const expirationTime = Date.now() + 5 * 60 * 1000;
    
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
          res.redirect(`/otp?userName=${User.username}&email=${User.email}&phoneNumber=${User.phoneNumber}&age=${User.age}&password=${User.password}&block=${User.block}`);
        });
    }catch (err) {
        console.error(`Error inserting user: ${err}`);
      }
}


const logout = (req,res)=>{
    req.session.email = null;
    res.redirect("/");
}

const renderBook = (req,res)=>{
    let session = req.session.email;
    let warning = req.session.errormsg;
    res.render('book',{title: 'Book',session,warning});
}

const bookDetails = (req,res)=>{
    let session = req.session.email;
    let warning = req.session.errormsg;
    res.render('book-detail',{title: 'Bookdetails',session,warning});
}



module.exports = {
    renderHome,
    loginVarification,
    userSignup,
    renderSignup,
    logout,
    renderBook,
    bookDetails,
    renderOTP,
    verifyOTP,
    resendOTP,
}