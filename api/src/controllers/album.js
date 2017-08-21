const fs = require('fs')
const path = require('path')
const pagination = require('mongoose-pagination')

const Album = require('../models/album')
const Song = require('../models/song')
const Artist = require('../models/artist')

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
			album: albumStored
		})
	})
}

albumController.view = (req, res) => {
	const albumId = req.params.id
	Album.findById(albumId).populate({path: 'artist'}).exec((err,album)=>{
		if (err)
			return res.status(500).json({message:`error: ${err}`})
		else
			if (!album) return res.status(404).json({message:'album not found'})
		res.status(200).json({
			message: 'success',
			album: album
		})
	})
}

albumController.all = (req, res) => {
	const artistId = req.params.artistId
	let find = null

	if (!artistId)
		find = Album.find({}).sort('title')
	else
		find = Album.find({artist: artistId}).sort('year')

	find.populate({path: 'artist'}).exec((err,albums)=>{
		if (err)
			return res.status(500).json({message:`error: ${err}`})
		else
			if (!albums) return res.status(404).json({message:'albums not found'})

		res.status(200).json({
			message: 'success',
			albums: albums
		})
	})

}

albumController.update = (req, res) => {

	const albumId = req.params.id
	const update = req.body
	update.modifiedAt = Date.now()

	console.log(update)

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if (err) return res.status(500).json({
			message:'error updating album',
			error: err
		})
		else
			if (!albumUpdated) return res.status(404).json({
				message:'failed to update album',
				error: 'album not found'
			})

		res.status(200).json({
			message: 'album successfully updated',
			album: albumUpdated
		})
	})
}

module.exports = albumController
