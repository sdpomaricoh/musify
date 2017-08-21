const fs = require('fs')
const path = require('path')

const Artist = require('../models/artist')
const Album = require('../models/album')
const Song = require('../models/song')

const artistController = {}

artistController.save = (req, res) =>{

	if (!req.body.name || !req.body.description) return res.status(500).send({
		message: 'must provide an name or description to create a artist'
	})

	const artist = new Artist()
	artist.name = req.body.name
	artist.description = req.body.description
	artist.image = null

	if (artist.name === '' && artist.description === '')
		return res.status(202).json({
			message: 'a name or description must be provided'
		})

	artist.save((err, artistStored) =>{
		if (err)
			return res.status(500).json({message: 'error to create artist', error: err})
		else
			if (!artistStored)
				return res.status(404).json({message: 'artist not saved'})
		return res.status(200).json({
			message: 'artist created successfully',
			user: artistStored
		})
	})

}

artistController.view = (req, res) =>{
	const artistId = req.params.id
	Artist.findById(artistId,(err, artist)=>{
		if (err) return res.status(500).json({message:`error: ${err}`})
		if (!artist) return res.status(404).json({message:'artist not found'})
		res.status(200).json({
			message: 'success',
			artist: artist
		})
	})
}

module.exports = artistController
