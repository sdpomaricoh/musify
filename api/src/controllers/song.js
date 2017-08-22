const fs = require('fs')
const path = require('path')
const pagination = require('mongoose-pagination')

const Album = require('../models/album')
const Song = require('../models/song')
const Artist = require('../models/artist')


songController = {}

songController.save = (req,res) => {

	console.log(req.body)

	if (!req.body.number || !req.body.title || !req.body.duration || !req.body.album ) return res.status(500).send({
		message: 'must provide an number,title, duration or album to create a song'
	})

	const song = new Song()
	song.number = req.body.number
	song.title = req.body.title
	song.duration = req.body.duration
	song.album = req.body.album
	song.file = null

	if (song.number === '' || song.title === '' || song.duration === '' || song.album === '')
		return res.status(202).json({
			message: 'a number, title, duration or album must be provided'
		})


	song.save((err, songStored) =>{
		if (err)
			return res.status(500).json({message: 'error to create song', error: err})
		else
			if (!songStored)
				return res.status(404).json({message: 'song not saved'})
		return res.status(200).json({
			message: 'song created successfully',
			song: songStored
		})
	})
}

songController.view = (req, res) => {
	const songId = req.params.id
	Song.findById(songId).populate({path: 'album'}).exec((err,song)=>{
		if (err)
			return res.status(500).json({message:`error: ${err}`})
		else
			if (!song) return res.status(404).json({message:'song not found'})
		res.status(200).json({
			message: 'success',
			song: song
		})
	})
}

songController.all = (req, res) => {
	const albumId = req.params.id
	let find = null

	if (!albumId)
		find = Song.find({}).sort('title')
	else
		find = Song.find({album: albumId}).sort('number')

	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec((err,songs)=>{
		if (err)
			return res.status(500).json({message:`error: ${err}`})
		else
			if (!songs) return res.status(404).json({message:'songs not found'})

		res.status(200).json({
			message: 'success',
			songs: songs
		})
	})

}

songController.update = (req, res) => {

	const songId = req.params.id
	const update = req.body
	update.modifiedAt = Date.now()

	Album.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if (err) return res.status(500).json({
			message:'error updating song',
			error: err
		})
		else
			if (!songUpdated) return res.status(404).json({
				message:'failed to update song',
				error: 'song not found'
			})

		res.status(200).json({
			message: 'song successfully updated',
			song: songUpdated
		})
	})
}

songController.delete = (req, res) => {
	const songId = req.params.id
	Song.findByIdAndRemove(songId, (err, songRemoved)=>{
		if (err) return res.status(500).json({
			message: 'error deleting song',
			error: err
		})
		else
			if (!songRemoved) return res.status(404).json({
				message:'the songs could not be removed',
				error: 'song not found'
			})

		res.status(200).json({
			message: 'song successfully removed',
			artist: songRemoved
		})
	})
}

songController.uploadAudio = (req, res) => {
	const songId = req.params.id
	const audioType = ['mp3','ogg']

	if (req.files) {
		const filePath = req.files.file.path
		const fileName = filePath.substring(filePath.lastIndexOf('/')+1)
		const fileType = req.files.file.type.split('/')
		const audioExt = fileType[1]

		if (audioType.indexOf(audioExt) !== -1)
			Song.findByIdAndUpdate(songId, {file: fileName}, (err, songUpdated) => {
				if (err) return res.status(500).json({
					message:'error updating song',
					error: err
				})
				else
					if (!songUpdated) return res.status(404).json({
						message:'failed to update song',
						error: 'song not found'
					})
				res.status(200).json({
					message: 'song successfully updated',
					song: songUpdated
				})
			})
		else
			return res.status(200).json({message: 'invalid file'})
	} else
		return res.status(200).json({message: 'Has not uploaded a audio file'})
}


songController.getAudioFile = (req, res) => {

	const audioFile = req.params.audioFile
	const uploadDir = path.resolve( __dirname,'../../uploads/songs')
	const pathFile = `${uploadDir}/${audioFile}`

	fs.exists(pathFile, (exists) =>{
		if (exists)
			res.sendFile(path.resolve(pathFile))
		else
			return res.status(404).json({message:'audio not found'})

	})
}


module.exports = songController
