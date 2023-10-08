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
    },
    iconImage: {
        type: Buffer,
        required: true
    },
    iconImageType: {
        type: String,
        required: true
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

directorSchema.virtual('iconImagePath').get(function() {
    if (this.iconImage != null && this.iconImageType != null) {
        return `data:${this.iconImageType};charset=utf-8;base64,${this.iconImage.toString('base64')}`
    }
})

module.exports = new mongoose.model('Director', directorSchema)