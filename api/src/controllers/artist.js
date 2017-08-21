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

	if (artist.name === '' || artist.description === '')
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
		else
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
	update.modifiedAt = Date.now()

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if (err) return res.status(500).json({
			message:'error updating artist',
			error: err
		})
		else
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


artistController.delete = (req, res) =>{
	const artistId = req.params.id

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if (err) return res.status(500).json({
			message: 'error deleting artist',
			error: err
		})
		else
			if (!artistRemoved) return res.status(404).json({
				message:'the artist could not be removed',
				error: 'artist not found'
			})

		Album.find({artist: artistRemoved._id}).remove((err,albumRemoved)=> {
			if (err) return res.status(500).json({
				message: 'error deleting album',
				error: err
			})
			else
				if (!albumRemoved) return res.status(404).json({
					message:'The album could not be removed',
					error: 'album not found'
				})
			Song.find({album: albumRemoved._id}).remove((err,songRemoved)=> {
				if (err) return res.status(500).json({
					message: 'error deleting songs',
					error: err
				})
				else
					if (!songRemoved) return res.status(404).json({
						message:'the songs could not be removed',
						error: 'songs not found'
					})

				res.status(200).json({
					message: 'artist successfully removed',
					artist: artistRemoved
				})
			})
		})
	})

}


artistController.uploadImage = (req, res) => {
	const artistId = req.params.id
	const imageType = ['png','jpg','gif','bmp','jpeg']

	if (req.files) {
		const filePath = req.files.image.path
		const fileName = filePath.substring(filePath.lastIndexOf('/')+1)
		const fileType = req.files.image.type.split('/')
		const imgExt = fileType[1]

		if (imageType.indexOf(imgExt) !== -1)
			Artist.findByIdAndUpdate(artistId, {image: fileName}, (err, artistUpdated) => {
				if (err) return res.status(500).json({
					message:'error updating artist',
					error: err
				})
				else
					if (!artistUpdated) return res.status(404).json({
						message:'failed to update artist',
						error: 'artist not found'
					})
				res.status(200).json({
					message: 'artist successfully updated',
					artist: artistUpdated
				})
			})
		else
			return res.status(200).json({message: 'invalid file'})
	} else
		return res.status(200).json({message: 'Has not uploaded a image'})
}

artistController.getImageFile = (req, res) => {
	const imageFile = req.params.imageFile
	const uploadDir = path.resolve( __dirname,'../../uploads/artists')
	const pathFile = `${uploadDir}/${imageFile}`

	fs.exists(pathFile, (exists) =>{
		if (exists)
			res.sendFile(path.resolve(pathFile))
		else
			return res.status(404).json({message:'image not found'})

	})
}

module.exports = artistController
