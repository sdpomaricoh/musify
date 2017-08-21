const express = require('express')
const multipart = require('connect-multiparty')
const userController = require('../controllers/user')
const authController = require('../controllers/auth')
const artistController = require('../controllers/artist')
const isAuth = require('../middleware/auth.js')
const router = express.Router()

const path = require('path')
const uploadDir = path.resolve( __dirname,'../../uploads/users')
const mpMiddleware = multipart({uploadDir: uploadDir})


router.post('/', (req,res) => {
	res.status(200)
	.json(
		{message:'welcome to musify service'}
	)
})

/**
 * user routes
 */
router.post('/user', userController.save)
router.put('/user/:id', isAuth, userController.update)
router.get('/user/:id', isAuth, userController.view)
router.delete('/user/:id', isAuth, userController.delete)
router.post('/user/upload/:id', isAuth, mpMiddleware, userController.uploadImage)
router.get('/user/image/:imageFile', isAuth, userController.getImageFile)

/**
 * user routes
 */
router.post('/artist', artistController.save)


/**
 * auth routes
 */
router.post('/login', authController.login)

module.exports = router
