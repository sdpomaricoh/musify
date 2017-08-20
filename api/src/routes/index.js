const express = require('express');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/', (req,res) => {
	res.status(200)
	.json(
		{message:'welcome to musify service'}
	);
});

/**
 * user routes
 */
router.route('/user').post(userController.save);

/**
 * auth routes
 */
router.post('/login', authController.login);

module.exports = router;
