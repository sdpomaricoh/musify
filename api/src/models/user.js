const mongo = require('mongoose');
const Schema = mongo.Schema;

const User = Schema({
	name: String,
	lastname: String,
	email: String,
	password: String,
	role: String,
	image: String
});

module.exports = mongoose.model('User', User);
