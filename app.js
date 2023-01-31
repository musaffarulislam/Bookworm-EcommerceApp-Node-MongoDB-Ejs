const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const logger = require('morgan');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose')

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

const connectdb = require('./server/database/connection')
connectdb()

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: process.env.sessionKey,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));


//to prevent storing cache
app.use((req, res, next) =>{
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate",
  );
  next();
})

dotenv.config({path : '.env'});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRouter);
app.use('/', userRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  

// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


const PORT = process.env.port||4040
app.listen(PORT,()=>{
    console.log(`Port running on ${PORT}`)
})

