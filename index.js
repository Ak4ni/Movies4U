
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

  //DB for movies4u
  const Movies4Udb = Models.Movie;
  const Users = Models.User;


  //connect database
  mongoose.connect('mongodb://localhost:27017/Movies4Udb', { useNewUrlParser: true, useUnifiedTopology: true });
 
//morgan
app.use(morgan("common"));
//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//default text repose when at /
app.get("/", (req, res) => {
  res.send("Welcome to Movies4U!");
}),
app.get('/documentation', (req, res) => {
  res.sendfile('/public/documentation.html', {root: __dirname})
});

//query db for movies
app.get("/movies", (req, res) => {
  Movies4Udb.find()
  .then((movies)=> {
    res.status(201).json(movies);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});



//Get data specific by Title
app.get("/movies/:Title", (req, res) => {
  Movies4Udb.findOne({Title:req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });


  //Get JSON genre info when looking for specific genre
  app.get("/genre/:Name", (req, res) =>{
    Movies4Udb.findaOne({Name: req.params.Name })
    .then((genre) => {
      res.json(genre.Description);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

  // Get info on Directors
  app.get("/director/:Name", (req, res) =>{
    Movies4Udb.findaOne({Name: req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });


  // Get all users
app.get("/user", function (req, res) {
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
app.post('/users/:newUser', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});



// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Delete a user by username
app.delete('/users/:Username', (req, res) => {
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
app.post('/users/:Username/movies/:MovieID', (req, res) => {
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
app.delete('/users/:userName/movies/:title', (req, res) => {
  Users.findOneAndUpdate({userName: req.params.userName}, {
      $pull: {FavoriteMovies: req.params.title}
  },
  { new: true},
 (err, updatedUser) => {
     if (err) {
         console.error(err);
         res.status(500).send('Error' + err);
     } else {
         res.json(updatedUser);
     }
 });
});

//Add/create a new user
app.post("/users/:newUser", (req, res) => {
  res.send("Registration complete.");
});


//Update user information
app.put("/users/:username", (req, res) => {
  res.send("User Profile Updated");
});

//Disable/delete the user profile
app.delete("/users/:deleteUser", (req, res) => {
  res.send("Profile disabled!");
});

//Add new movie to list of favorite
app.post("/favorite/:movieName", (req, res) => {
  res.send("Added to favorites!");
});

// Delete movie from list of favorite
app.delete("/favorite/:deleteMovie", (req, res) => {
  res.send("Removed from favorites.");
});

//Morgan Logger
app.use(morgan('common'));
app.get('/secreturl', (req, res) =>{
    res.send('This is top SECRET content!')
});


// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ops, That's not here!");
});

//Listener
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});