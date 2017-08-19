const mongo = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongo.Schema;

const userSchema = Schema({
	name: String,
	lastname: String,
	email: {
		type: String,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		select: false
	},
	role: {
		type: String,
		enum: ['administrator','user']
	},
	image: String,
	signup: {
		type: Date,
		default: Date.now()
	},
	lastLogin: Date
});

/**
 * encrypt password before save
 */
userSchema.pre('save', ()=>{

	const user = this;
	if (!user.isModified('password')) return next();

	bcrypt.genSalt(10, (err, salt)=>{
		if (err) return next(err);
		bcrypt.hash(user.password, salt, null, (err, hash)=>{
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
	return next();
});

module.exports = mongoose.model('User', userSchema);
