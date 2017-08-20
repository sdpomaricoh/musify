const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const userSchema = Schema({
	name: String,
	lastname: String,
	email: {
		type: String,
		unique: true,
		lowercase: true
	},
	password: String,
	role: {
		type: String,
		enum: ['admin','user']
	},
	image: String,
	signup: {
		type: Date,
		default: Date.now()
	},
	lastLogin: Date
})

/**
 * encrypt password before save
 */
userSchema.pre('save', function (next) {
	const user = this
	if (!user.isModified('password')) return next()

	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err)
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err)
			user.password = hash
			next()
		})
	})
})

module.exports = mongoose.model('User', userSchema)
