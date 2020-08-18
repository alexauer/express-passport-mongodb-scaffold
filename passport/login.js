const LocalStrategy   = require('passport-local').Strategy;
const User = require('../models/user');
const bCrypt = require('bcryptjs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			// check in mongo if a user with username exists
			User.findOne({ 'username' :  username }, 
				function(err, user) {
					// In case of any error, return using the done method
					if (err)
						return done(err);
					// Username does not exist, log the error and redirect back
					if (!user){
						console.log('not usa')
						return done(null, false);                 
					}
					// User exists but wrong password, log the error 
					if (!isValidPassword(user, password)){
						console.log('not gurt')
						return done(null, false); // redirect back to login page
					}
					// User and password both match, return user from done method
					// which will be treated like success
					console.log('gurt')
					return done(null, user);
				}
			);
		})
	);

	const isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	}
}