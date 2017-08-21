const fs = require('fs')
const path = require('path')
const pagination = require('mongoose-pagination')

const Album = require('../models/album')
const Song = require('../models/song')

const albumController = {}

albumController.save = (req, res) => {

	if (!req.body.title || !req.body.description || !req.body.artist) return res.status(500).send({
		message: 'must provide an title, description or artist to create a artist'
	})

	const album = new Album()
	album.title = req.body.title
	album.description = req.body.description
	album.year = req.body.year ? req.body.year : 'no defined'
	album.artist = req.body.artist
	album.image = null

	if (album.name === '' || album.description === '' || album.artist === '' || album.year === '')
		return res.status(202).json({
			message: 'a title, description, artist or year must be provided'
		})

	album.save((err, albumStored) =>{
		if (err)
			return res.status(500).json({message: 'error to create album', error: err})
		else
			if (!albumStored)
				return res.status(404).json({message: 'album not saved'})
		return res.status(200).json({
			message: 'album created successfully',
			user: albumStored
		})
	})
}

module.exports = albumController
