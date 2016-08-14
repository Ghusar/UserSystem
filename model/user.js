var mongoose = require('mongoose');


var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
	username:{
		type:String,
	},
	password:{
		type:String
	}
});


var User = module.exports = mongoose.model('User',userSchema);

module.exports.createUser = function(newuser,callback){
	//console.log(newuser);
	this.getUserByUsername(newuser.username,function(err,user){
		if(err) console.log(err);
		else if(user) callback({message:"user already exist try another name",user:null});
		else{
			console.log(newuser+ " aya re aya data base me aya");
			bcrypt.hash(newuser.password,10,function(err,hash){
			if(err) console.log(err);
			newuser.password = hash;
			console.log(newuser.password);
			console.log("bhedh re"+newuser.username);
			newuser.save(callback({message:"user is ok",user:newuser.username}));
		});
		}
	});
}


module.exports.getUserById = function(id,callback){
	var query = {_id:id};

	User.findOne(query,callback);
}

module.exports.getUserByUsername = function(username,callback){
	var query = {username:username};

	User.findOne(query,callback);
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
	console.log(hash);
	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if(err) return callback(err);
		console.log("checking password todo");
		callback(null,isMatch);
	});
}
