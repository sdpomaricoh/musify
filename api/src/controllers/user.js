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

	if (user.name === null && user.email === null && user.password === null)
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
	var userId = req.params.id
	var update = req.body
	User.findByIdAndUpdate(userId,update, (err, userUpdate) => {
		if (err) return res.status(500).json({
			message:'error updating user',
			error: err
		})
		if (!userUpdate) return res.status(404).json({message:'failed to update user'})
		res.status(200).json({
			message: 'user successfully updated',
			user: userUpdate
		})
	})
}

userController.view = (req, res) =>{
	var userId = req.params.id
	User.findById(userId,(err, user)=>{
		if (err) return res.status(500).json({message:`error: ${err}`})
		if (!user) return res.status(404).json({message:'user not found'})
		res.status(200).json({
			message: 'success',
			user: user
		})
	})
}

userController.delete = (req, res) =>{
	var userId = req.params.id
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

module.exports = userController
