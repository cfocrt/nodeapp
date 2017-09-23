const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeapp');
const db = mongoose.connection;
const bcrypt = require('bcryptjs');

//User Schema
const UserSchema = mongoose.Schema({
	username: {
		type: String,
		//unique: true,
		index: true,
		//dropDups: true
	},
	password: {
		type: String
	},
	email: {
		type: String,
		//unique: true,
		//dropDups: true
	},
	name: {
		type: String
	}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback)=> {
	bcrypt.genSalt(10, (err, salt)=> {
		bcrypt.hash(newUser.password, salt, (err, hash)=> {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.getUserByUsername = (username, callback)=>{
	let query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserByEmail = (email, callback)=>{
	let query = {email: email};
	User.findOne(query, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback)=>{
	bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
		if(err) throw err;
		callback(null, isMatch);
	});
}

module.exports.getUserByID = (id, callback)=>{
	User.findById(id, callback);
}