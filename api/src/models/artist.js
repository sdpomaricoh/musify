const mongo = require('mongoose')
const Schema = mongo.Schema

const artistSchema = Schema({
	name: String,
	lastname: String,
	image: String,
	createAt: {
		type: Date,
		default: Date.now()
	},
	modifiedAt: Date
})

module.exports = mongoose.model('Artist', artistSchema)
