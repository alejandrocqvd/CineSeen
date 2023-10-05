const mongoose = require('mongoose')
const Movie = require('./movie')

const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    notes: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        validate: {
            validator: function(value) {
                return Number.isInteger(value);
            },
            message: '{VALUE} is not an integer value'
        }
    }
})

directorSchema.pre('remove', async function(next) {
    try {
        const movies = await Movie.find({ director: this._id });
        if (movies && movies.length > 0) {
            next(new Error('Director still has movie(s)'));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

module.exports = new mongoose.model('Director', directorSchema)