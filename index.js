// to check
// type 'mongo'
// type 'show dbs'
// type 'user Movies4Udb'
// type db.getCollectionNames()

// type 'db.movies.find().pretty()'
// type 'db.users.find().pretty()'

//mongodb
const mongoose = require('mongoose');
const Models = require('./models.js');
const {check, validationResult} = require('express-validator');

//DB for movies4u
const Movies4Udb = Models.Movie;
const Users = Models.User;

 //connect database
 mongoose.connect(process.env.MOVIES4U_1, { useNewUrlParser: true, useUnifiedTopology: false });

//express
const express = require("express");

//morgan
const morgan = require("morgan");

//bodyparser
const bodyParser = require("body-parser");

//UUID
const uuid = require('uuid');

//get instance from express
const app = express();


//cors
const cors = require('cors');
  app.use(cors());
  app.options('*', cors());

  //morgan module use
  app.use(morgan("common"));


//bodyParser module use
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//import passport and require module
const passport = require('passport');
  require('./passport'); 

//Ensures that Express is available in auth.js file
  let auth = require('./auth')(app);

//Morgan Logger
app.use(morgan('common'));

//Use express static function so that request are routed to corresponding folders
app.use(express.static('public'));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ops, That's not here!");
});



//default text repose when at /
app.get("/", (req, res) => {
  res.send("Welcome to Movies4U!");
});
app.get('/documentation', (req, res) => {
  res.sendfile('/public/documentation.html', {root: __dirname})
});

//query db for movies
app.get("/movies", function (req, res) {
  Movies4Udb.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});


//Get data specific by Title
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies4Udb.findOne({Title:req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });


  //Get data about genre by name/title
  app.get('/genres/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies4Udb.findOne({'Genre.Name': req.params.genre})
    .then((movie)=>{
        res.json(movie.Genre)
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
});

  // Get info on Directors
  app.get('/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies4Udb.findOne({'Director.Name': req.params.directorName})
    .then((movie)=>{
        res.json(movie.Director);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
})


  // Get all users
app.get("/user", passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.find()
    .then(function (users){
      res.status(201).json(users);
    })
    .catch(function(err){
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//Allow user to update their user info
app.put('/users/:Username', [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non-alphanumeric characters, not allwed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be validated').isEmail()
],
(req, res) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete movie from list of favorite 
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


//Listener
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});