const express = require("express");
  const morgan = require("morgan");
  const bodyParser = require("body-parser");
  const app = express();
 
//morgan
app.use(morgan("common"));
//bodyParser
app.use(bodyParser.json());

  let topMovies = [
  {
    title: "The Matrix",
    producer: {
      name:"Joel Silver",
      location: "U.S.A"
    },
    genre: "Action"
  },
  {
    title: "The Matrix Reloded",
    producer:{ 
      name:"Joel Silver",
      location: "U.S.A"
    },
    genre: "Action"
   },
  {
    title: "The Matrix Revolutions",
    producer: {
      name: "Joel Silver",
      location:"U.S.A"
  },
  genre: "Action"
},
  {
    title: "Back to the Future'",
    producer: {
      name: "Robert Zemeckis",
      location:"U.S.A"
    },
    genre: "Adventure"
  },
  {
    title: "Alita: Battle Angel",
    producer: {
      name: "James Cameron",
      location:"Japan"
  },
  genre: "Action"
},
  {
    title: "Howls Moving Castle",
    producer: {
      name:"Studio Ghibli",
      location:"Japan"
  },
  genre:"Drama"
},
  {
    title: "Looper",
    producer: {
      name: "Ram Bergman and James D. Stern",
      location: "U.S.A"
    },
    genre: "Action"
  },
  {
    title: "Blade Runner",
    producer: {
      name: "Ridley Scott",
      locaion: "U.S.A"
    },
    genre: "Action"
  },
  {
    title: "Blade Runner 2049",
    producer: {
      name: "Denis Villeneuve",
      location:"U.S.A"
    },
    genre:"Action"
  },
  {
    title: "Speed Racer",
    producer: {
      name: "Lana & Lilly Wachowski",
      location:"U.S.A"
    },
    genre:"Adventure"
  }
];

app.get("/", (req, res) => {
  res.send("Welcome to Movies4U!");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.use(express.static("public"));

//Get List of All Movies
app.get("/movies", (req, res) => {
  res.status(200).json(topMovies);
});

//Get data specific by Title
app.get("/movies/:title", (req, res) => {
  res.status(200).json(
    topMovies.find(movie => {
      return movie.title === req.params.title;
    })
  );
});

//Get data about genre by name & title
app.get("/genres/:genre", (req, res) => {
  res.status(200).json(
    topMovies.find(genre => {
      return genre.genre === req.params.genre;
    })
  );
});

// Get data about Producers
app.get("/producers/:producerName", (req, res) => {
  res.status(200).json(
    topMovies.find(producer => {
      return producer.producer.name === req.params.producerName;
    })
  );
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



// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ops, That's not here!");
});

//Listener
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
