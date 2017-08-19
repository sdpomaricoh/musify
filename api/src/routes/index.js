const express = require('express');
const userController = require('../controllers/user');
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

module.exports = router;
