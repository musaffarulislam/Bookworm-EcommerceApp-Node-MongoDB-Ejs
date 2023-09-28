const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const logger = require('morgan');
const app = express();
const dotenv = require('dotenv');


const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

const renderError = require('./midlewares/error')

const connectdb = require('./config/connection')
connectdb()

dotenv.config({path : '.env'});

const oneWeek = 1000 * 60 * 60 * 24 * 7;
app.use(sessions({
    secret: process.env.sessionKey,
    saveUninitialized:true,
    cookie: { maxAge: oneWeek },
    resave: false 
}));


app.use((req, res, next) =>{
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate",
  );
  next();
}) 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log("Try 2")
app.use('/admin', adminRouter);
app.use('/', userRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  

// error handler
app.use(renderError);


const PORT = process.env.port||4040
app.listen(PORT,()=>{
    console.log(`Port running on ${PORT}`)
})

