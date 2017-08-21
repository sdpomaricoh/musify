/**
 * Import dependencies
 */
const express = require('express')
// const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
require('dotenv').config()

/**
 * config libraries
 */
const database = require('./libs/mongo')


/**
 * [initialize express framework]
 * @type {object}
 */
const app = express()


/**
 * Configure express dependencies
 */
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

/**
 * config headers to use rest method
 */
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
	)
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
	next()
})

/**
 *import routes
 */
const router = require('./routes')
app.use('/', router)


app.listen(process.env.PORT || 3000, ()=> {
	console.log(`app running on port ${process.env.PORT}`)
	database.connect()
})

module.exports = app
