//var passport = require('passport');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var User = require('../model/user.js');


passport.serializeUser(function(user,done){
	console.log("serializing user "+user.username);
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	User.getUserById(id,function(err,user){
		done(err,user);
	});
	return done("null",{username:username});
});

passport.use(new LocalStrategy(
	function(username,password,done){
		User.getUserByUsername(username,function(err,user){
			if(err) return done(err);
			
			if(!user){
				console.log("not a valid user");
				return (null,false,{message:"not valid user"});
			}
			console.log(user);
			User.comparePassword(password,user.password,function(err,isMatch){
				if(err) return done(err);
				if(isMatch){
					console.log("tu jo mila to ho gaya");
					return done(null,user);
				}
				else{
					console.log("invalid password");
					return  done(null,false,{message:"invalid password"});
				}

			});
				
	});
	}
));

module.exports = passport;
