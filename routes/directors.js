const express = require('express')
const router = express.Router()
const Director = require('../models/director')
const Movie = require('../models/movie')

// All Directors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const directors = await Director.find(searchOptions)
        res.render('directors/index', {
            directors: directors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Director Route
router.get('/new', (req, res) => {
    res.render('directors/new', { director: new Director() })
})

// Create Director Route
router.post('/', async (req, res) => {
    const director = new Director({
        name: req.body.name,
        description: req.body.description,
        rating: req.body.rating,
        notes: req.body.notes
    })
    try {
        const newDirector = await director.save()
        res.redirect(`directors/${newDirector.id}`)
    } catch {
        res.render('directors/new', {
            director: director,
            errorMessage: 'Error Creating Director'
        })
    }
})

// Show Director Route
router.get('/:id', async (req, res) => {
    try {
        const director = await Director.findById(req.params.id)
        const filmography = await Movie.find({ director: director.id} ).limit(6).exec()
        res.render('directors/show', {
            director: director,
            filmography: filmography
        })
    } catch {
        res.redirect('/')
    }
})

// Edit Director Route
router.get('/:id/edit', async (req, res) => {
    try {
        const director = await Director.findById(req.params.id)
        res.render('directors/edit', { director: director })
    } catch {
        res.redirect('/directors')
    }
})

// Update Director Route
router.put('/:id', async (req, res) => {
    let director
    try {
        director = await Director.findById(req.params.id)
        director.name = req.body.name
        director.description = req.body.description
        director.rating = req.body.rating
        director.notes = req.body.notes
        await director.save()
        res.redirect(`/directors/${director.id}`)
    } catch {
        if (director == null) {
            res.redirect('/')
        } else {
            res.render('directors/edit', {
                director: director,
                errorMessage: 'Error Updating Director'
            })
        }
    }
})

// Delete Director Route
router.delete('/:id', async (req, res) => {
    let director
    try {
        director = await Director.findById(req.params.id)
        if (!director) {
            res.redirect('/')
        }
        const filmography = await Movie.find({ director: director._id })
        if (filmography.length > 0) {
            return res.render('directors', {
                directors: [],
                searchOptions: {},
                errorMessage: 'Delete Error: Director has movies still'
            })
        }
        await Director.deleteOne({ _id: req.params.id })
        res.redirect('/directors')
    } catch {
        res.redirect('/')
    }
})

module.exports = router