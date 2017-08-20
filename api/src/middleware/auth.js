const jwt = require('jwt-simple')
const moment = require('moment')

function isAuth(req, res, next) {
	if (!req.headers.authorization) return res.status(403).json({
		message: 'you do not have access'
	})

	const token = req.headers.authorization.replace(/['"]+/g,'')

	try {

		playload = jwt.decode(token, process.env.SECRET)

		if (playload.exp <= moment.unix()) res.status(401).json({
			message: 'the token has expired'
		})

	} catch (e) {
		res.status(500).json({
			message: 'invalid token'
		})
	}

	req.user = playload.sub

	next()
}

module.exports = isAuth
