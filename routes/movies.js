const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')
const Director = require('../models/director')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Movies Route
router.get('/', async (req, res) => {
    let query = Movie.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.runtime != null && req.query.runtime != '') {
        query = query.regex('runtime', new RegExp(req.query.runtime, 'i'))
    }
    if (req.query.releasedBefore != null && req.query.releasedBefore != '') {
        query = query.lte('releaseDate', req.query.releasedBefore)
    }
    if (req.query.releasedAfter != null && req.query.releasedAfter != '') {
        query = query.gte('releaseDate', req.query.releasedAfter)
    }
    try {
        const movies = await query.exec()
        res.render('movies/index', {
            movies: movies,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Movie Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Movie())
})

// Create Movie Route
router.post('/', async (req, res) => {
    const movie = new Movie({
        title: req.body.title,
        director: req.body.director,
        releaseDate: new Date(req.body.releaseDate),
        runtime: req.body.runtime,
        description: req.body.description
    })
    savePoster(movie, req.body.poster)
    try {
        const newMovie = await movie.save()
        res.redirect(`movies/${newMovie.id}`)
    } catch {
        renderNewPage(res, movie, true)
    }
})

// Show Movie Route
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('director').exec()
        res.render('movies/show', { movie: movie })
    } catch {
        res.redirect('/')
    }
})

// Edit Movie Route
router.get('/:id/edit', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
        renderEditPage(res, movie)
    } catch {
        res.redirect('/')
    }
})

// Update Movie Route
router.put('/:id', async (req, res) => {
    let movie 
    try {
        movie = await Movie.findById(req.params.id)
        movie.title = req.body.title
        movie.director = req.body.director
        movie.releaseDate = new Date(req.body.releaseDate)
        movie.runtime = req.body.runtime
        movie.description = req.body.description
        if (req.body.poster != null && req.body.poster != '') {
            savePoster(movie, req.body.poster)
        }
        await movie.save()
        res.redirect(`/movies/${movie.id}`)
    } catch {
        if (movie != null) {
            renderEditPage(res, movie, true)
        } else {
            res.redirect('/')
        }
    }
})

// Delete Movie Route
router.delete('/:id', async (req, res) => {
    let movie 
    try {
        movie = await Movie.findById(req.params.id)
        await Movie.deleteOne({ _id: req.params.id })
        res.redirect('/movies')
    } catch {
        if (movie != null) {
            res.render('movies/show', {
                movie: movie,
                errorMessage: 'Could not remove movie'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, movie, hasError = false) {
    renderFormPage(res, movie, 'new', hasError)
}

async function renderEditPage(res, movie, hasError = false) {
    renderFormPage(res, movie, 'edit', hasError)
}

async function renderFormPage(res, movie, form, hasError = false) {
    try {
        const directors = await Director.find({})
        const params = {
            directors: directors,
            movie: movie,
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Movie'
            } else {
                params.errorMessage = 'Error Creating Movie'
            }
        }
        res.render(`movies/${form}`, params)
    } catch {
        res.redirect('/movies')
    }
}

function savePoster(movie, posterEncoded) {
    if (posterEncoded == null) return
    const poster = JSON.parse(posterEncoded)
    if (poster != null && imageMimeTypes.includes(poster.type)) {
        movie.posterImage = new Buffer.from(poster.data, 'base64')
        movie.posterImageType = poster.type
    }
}

module.exports = router