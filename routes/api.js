var express = require('express');
var path = require('path');
var router = express.Router();

var mongoose = require('mongoose');

var User = require('../model/user.js');

var passport = require('./passport-config.js');

router.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'../index.html'));
});

router.get('/failure',function(req,res){
	res.send({data:null,message:'invalid username or password'});
});

router.get('/success',function(req,res){
	console.log("ajajajajaj");
	res.send(req);
});



router.post('/submit',function(req,res){
	var name = req.body.username;
	var word = req.body.password;

	console.log(name);

	var user = new User({
		username:name,
		password:word
	});
	User.createUser(user,function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log(user);
		}
	});
});


router.post('/login',passport.authenticate('local',
	{
		failureRedirect:'/failure'
	}),
	function(req,res){
		console.log("aya re aya mera  ra....");
		//console.log(req);
		res.send({user:req.user.username,message:'you have successfully login'});
	}
);
module.exports = router;