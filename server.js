// Checks if application is not in production mode, if it isn't it loads the environment variables in .env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Import libraries and frameworks
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// Import all routers
const indexRouter = require('./routes/index')
const directorRouter = require('./routes/directors')
const movieRouter = require('./routes/movies')

// Using libraries, frameworks, and more
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(methodOverride('_method'))

// Import and set up MongooseDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Mount the routers on the root path of the application
app.use('/', indexRouter)
app.use('/directors', directorRouter)
app.use('/movies', movieRouter)

// Start the Express server on the port specified in .env, if not set, on port 3000
app.listen(process.env.PORT || 3000)