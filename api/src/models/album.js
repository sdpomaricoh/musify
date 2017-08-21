const mongoose = require('mongoose')
const Schema = mongoose.Schema

const albumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: {
		type: Schema.ObjectId,
		ref: 'Artist'
	},
	createAt: {
		type: Date,
		default: Date.now()
	},
	modifiedAt: Date
})

module.exports = mongoose.model('Album', albumSchema)
