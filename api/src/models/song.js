const mongo = require('mongoose');
const Schema = mongo.Schema;

const songSchema = Schema({
	number: Number,
	title: String,
	duration: String,
	file: String,
	album: {
		type: Schema.ObjectId,
		ref: 'Album'
	},
	createAt: {
		type: Date,
		default: Date.now()
	},
	modifiedAt: Date
});

module.exports = mongoose.model('Song', songSchema);
