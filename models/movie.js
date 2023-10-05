const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    releaseDate: {
        type: Date,
        required: true
    },
    runtime: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    posterImage: {
        type: Buffer,
        required: true
    },
    posterImageType: {
        type: String,
        required: true
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Director'
    }
})

movieSchema.virtual('posterImagePath').get(function() {
    if (this.posterImage != null && this.posterImageType != null) {
        return `data:${this.posterImageType};charset=utf-8;base64,${this.posterImage.toString('base64')}`
    }
})

module.exports = new mongoose.model('Movie', movieSchema)