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

module.exports = songController
