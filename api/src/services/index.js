const jwt = require('jwt-simple')
const moment = require('moment')

function createToken(user) {
	const playload = {
		sub: user._id,
		role: user.role,
		iat: moment().unix(),
		exp: moment().add(14,'days').unix()
	}
	token = jwt.encode(playload, process.env.SECRET)
	return token
}

function decodeToken(token) {
	const decode = new Promise((resolve, reject) =>{
		try {
			const playload = jwt.deconde(token, process.env.SECRET)
			if (playload <= moment.unix())
				resolve({
					status: 401,
					message: 'Token expired'
				})

			resolve(playload.sub)

		} catch (err) {
			reject({
				status: 500,
				message: 'invalid token'
			})
		}
	})

	return decode
}

module.exports = {
	createToken,
	decodeToken
}
