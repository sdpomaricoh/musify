const fs = require('fs')
const path = require('path')
const pagination = require('mongoose-pagination')

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


artistController.all = (req, res) =>{

	var page = null

	if (req.params.page) page = req.params.page
	else page = 1

	const itemsPerPage = 5

	Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total)=>{
		if (err)
			return res.status(500).json({message: 'error to get page', error: err})
		else
			if (!artists) return res.status(404).json({message: 'no artists to show'})

		res.status(200).json({
			total: total,
			artists: artists
		})
	})
}

artistController.update = (req, res) =>{
	const artistId = req.params.id
	const update = req.body

	console.log(update)

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if (err) return res.status(500).json({
			message:'error updating artist',
			error: err
		})
		if (!artistUpdated) return res.status(404).json({
			message:'failed to update artist',
			error: 'artist not found'
		})
		res.status(200).json({
			message: 'artist successfully updated',
			artist: artistUpdated
		})
	})
}


module.exports = artistController
