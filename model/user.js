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
	this.getUserByUsername(newuser.username,function(err,user,done){
		if(err) throw err;
		else if(user) console.log("user already exists");
		else{
			console.log(newuser+ " aya re aya data base me aya");
			bcrypt.hash(newuser.password,10,function(err,hash){
			if(err) console.log(err);
			newuser.password = hash;
			console.log(newuser.password);
			newuser.save(callback)
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
