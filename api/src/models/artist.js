const mongoose = require('mongoose')
const Schema = mongoose.Schema

const artistSchema = Schema({
	name: String,
	description: String,
	image: String,
	createAt: {
		type: Date,
		default: Date.now()
	},
	modifiedAt: Date
})

module.exports = mongoose.model('Artist', artistSchema)
