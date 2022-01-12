const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, require: true},
    Email:{type: String, require: true},
    Birthday: Date,
    Favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'
    }]
});

// this creates collections called db.movies and db.users (plurals and lower case)
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// need to be imported into index.js
module.exports.Movie = Movie;
module.exports.User = User;