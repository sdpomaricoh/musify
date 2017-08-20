const express = require('express')
const userController = require('../controllers/user')
const authController = require('../controllers/auth')
const isAuth = require('../middleware/auth.js')
const router = express.Router()

router.post('/', (req,res) => {
	res.status(200)
	.json(
		{message:'welcome to musify service'}
	)
})

/**
 * user routes
 */
router.post('/user',userController.save)
router.put('/user/:id',isAuth, userController.update)

/**
 * auth routes
 */
router.post('/login', authController.login)

module.exports = router
