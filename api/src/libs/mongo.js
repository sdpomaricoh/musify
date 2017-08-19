const mongo = require('mongoose');

const database = {};

database.connect = () =>{
	mongo.connect(
		`mongodb://localhost:${process.env.MONGO_PORT}/${process.env.DB_NAME}`,
		{ useMongoClient: true },
		(err,res) =>{
			if (err) {
				throw err;
			} else {
				console.log('database connection success');
			}
		});
};

module.exports = database;
