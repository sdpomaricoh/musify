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
			res.status(500).json({message: 'error to create user', error: err})
		else
			if (!userStored)
				res.status(404).json({message: 'user not registered'})

		res.status(200).json({
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
		if (err) res.status(500).json({message:'error updating user'})
		if (!userUpdate) res.status(404).json({message:'failed to update user'})
		res.status(200).json({
			message: 'user successfully updated',
			user: userUpdate
		})
	})
}

module.exports = userController
