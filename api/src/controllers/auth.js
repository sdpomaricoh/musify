const User = require('../models/user')
const bcrypt = require('bcrypt')
const services = require('../services')
const authController = {}

authController.login = (req, res) => {

	if (!req.body.email || !req.body.password) return res.status(500).json({
		message: 'email or password can not be empty'
	})

	const email = req.body.email
	const password = req.body.password


	User.findOne({email: email.toLowerCase()}, (err, user)=>{
		if (err) return res.status(500).json({ message: 'an error has occurred', error: err})
		if (!user) return res.status(404).json({message: 'user does not exist'})
		bcrypt.compare(password, user.password, (err, check) =>{
			if (check) {
				user.lastLogin = Date.now()
				user.save()
				return res.status(200).json({
					message: 'success',
					token: services.createToken(user)
				})
			}
			return res.status(404).json({message: 'the user could not login'})
		})
	})
}

module.exports = authController
