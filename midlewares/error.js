const error404 = function(err, req, res, next) {
    // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        const warning = res.locals.message;
        // render the error page
        res.status(err.status || 500);
        res.render('error',{warning});
}

module.exports = error404;