const fs = require('fs')
const path = require('path')
const User = require('../models/user')
const services = require('../services')
const userController = {}

userController.save = (req,res) => {

	const user = new User()

	if (!req.body.password || !req.body.email) return res.status(500).send({
		message: 'must provide an email or password to create a user'
	})

	user.name = req.body.name
	user.lastname = req.body.lastname
	user.email = req.body.email
	user.password = req.body.password
	user.role = 'user'
	user.image = null
	user.lastLogin = null

	if (user.name === '' && user.email === '' && user.password === '')
		return res.status(202).json({
			message: 'a name, email or password must be provided'
		})

	user.save((err, userStored)=>{

		if (err)
			return res.status(500).json({message: 'error to create user', error: err})
		else
			if (!userStored)
				return res.status(404).json({message: 'user not registered'})

		return res.status(200).json({
			message: 'user created successfully',
			user: userStored,
			token: services.createToken(userStored)
		})

	})
}

userController.update = (req,res) => {
	const userId = req.params.id
	const update = req.body
	User.findByIdAndUpdate(userId,update, (err, userUpdated) => {
		if (err) return res.status(500).json({
			message:'error updating user',
			error: err
		})
		else
			if (!userUpdate) return res.status(404).json({
				message:'failed to update user',
				error: 'user not found'
			})
		res.status(200).json({
			message: 'user successfully updated',
			user: userUpdated
		})
	})
}

userController.view = (req, res) =>{
	const userId = req.params.id
	User.findById(userId,(err, user)=>{
		if (err) return res.status(500).json({message:`error: ${err}`})
		else
			if (!user) return res.status(404).json({message:'user not found'})
		res.status(200).json({
			message: 'success',
			user: user
		})
	})
}

userController.delete = (req, res) =>{
	const userId = req.params.id
	User.findById(userId, (err, user)=>{
		if (err) return res.status(500).json({
			message: 'error deleting user',
			error:err
		})
		user.remove(err => {
			if (err) return res.status(500).json({
				message: 'error deleting user',
				error:err
			})
			res.status(200).json({message: 'user delete successfully'})
		})
	})
}

userController.uploadImage = (req, res) => {
	const userId = req.params.id
	const imageType = ['png','jpg','gif','bmp','jpeg']

	if (req.files) {
		const filePath = req.files.image.path
		const fileName = filePath.substring(filePath.lastIndexOf('/')+1)
		const fileType = req.files.image.type.split('/')
		const imgExt = fileType[1]

		if (imageType.indexOf(imgExt) !== -1)
			User.findByIdAndUpdate(userId, {image: fileName}, (err, userUpdate) => {
				if (err) return res.status(500).json({
					message:'error updating user',
					error: err
				})
				else
					if (!userUpdate) return res.status(404).json({
						message:'failed to update user',
						error: 'user not found'
					})
				res.status(200).json({
					message: 'user successfully updated',
					user: userUpdate
				})
			})
		else
			return res.status(200).json({message: 'invalid file'})
	} else
		return res.status(200).json({message: 'Has not uploaded a image'})
}

userController.getImageFile = (req, res) => {
	const imageFile = req.params.imageFile
	const uploadDir = path.resolve( __dirname,'../../uploads/users')
	const pathFile = `${uploadDir}/${imageFile}`

	fs.exists(pathFile, (exists) =>{
		if (exists)
			res.sendFile(path.resolve(pathFile))
		else
			return res.status(404).json({message:'image not found'})

	})
}

module.exports = userController
