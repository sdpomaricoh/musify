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

albumController.delete = (req, res) => {

	const albumId = req.params.id
	Album.findByIdAndRemove(albumId , (err,albumRemoved)=> {
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
				message: 'album successfully removed',
				artist: albumRemoved
			})
		})
	})

}

albumController.uploadImage = (req, res) => {
	const albumId = req.params.id
	const imageType = ['png','jpg','gif','bmp','jpeg']

	if (req.files) {
		const filePath = req.files.image.path
		const fileName = filePath.substring(filePath.lastIndexOf('/')+1)
		const fileType = req.files.image.type.split('/')
		const imgExt = fileType[1]

		if (imageType.indexOf(imgExt) !== -1)
			Album.findByIdAndUpdate(albumId, {image: fileName}, (err, albumUpdated) => {
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
		else
			return res.status(200).json({message: 'invalid file'})
	} else
		return res.status(200).json({message: 'Has not uploaded a image'})
}

albumController.getImageFile = (req, res) => {

	const imageFile = req.params.imageFile
	const uploadDir = path.resolve( __dirname,'../../uploads/albums')
	const pathFile = `${uploadDir}/${imageFile}`

	fs.exists(pathFile, (exists) =>{
		if (exists)
			res.sendFile(path.resolve(pathFile))
		else
			return res.status(404).json({message:'image not found'})

	})
}

module.exports = albumController
