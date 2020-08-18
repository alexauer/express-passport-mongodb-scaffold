var express = require('express');
var router = express.Router();

const isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()){
		return next();
	}else{
		res.redirect('/login');
	}
	// if the user is not authenticated then redirect him to the login page
}

module.exports = function(passport){
	
	/* GET login page. */
	router.get('/', isAuthenticated, function(req, res) {
		res.render('index', {title: 'Welcome to the Platform.'});
	});

	/* GET login page. */
	router.get('/login', function(req, res) {
		res.render('login', {title: 'Welcome to the Platform'});
	});

	/* Handle login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true 
	}));

	/* Handle Logout */
	router.get('/logout', isAuthenticated, function(req, res) {
		req.session.destroy();
		req.logout();
		res.redirect('/');
	});

	/* GET home page */
	router.get('/', isAuthenticated, function(req, res){
		const homeReq = require('./modules/home.js');
		homeReq.show(req, res);
	});

	/* GET registeration page. */
	router.get('/register', function(req, res, next) {
		res.render('register', {title:'Please register.', 
								message: req.flash('registerMessage')});
	});

	/* Handle registeration POST. */
	router.post('/register', passport.authenticate('signup', {
	    successRedirect: '/',
	    failureRedirect: '/register',
	    failureFlash : true
	}));

	return router;
}; 

