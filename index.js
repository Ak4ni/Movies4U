const express = require("express");
  morgan = require("morgan");

const app = express();

  app.use(morgan("common"));


  let topMovies = [
  {
    title: "The Matrix",
    producer: "Joel Silver"
  },
  {
    title: "The Matrix Reloded",
    producer: "Joel Silver"
  },
  {
    title: "The Matrix Revolutions",
    producer: "Joel Silver"
  },
  {
    title: "Back to the Future'",
    producer: "Robert Zemeckis"
  },
  {
    title: "Alita: Battle Angel",
    producer: "James Cameron"
  },
  {
    title: "Howls Moving Castle",
    producer: "Studio Ghibli"
  },
  {
    title: "Looper",
    producer: "Ram Bergman and James D. Stern"
  },
  {
    title: "Blade Runner",
    producer: "Ridley Scott"
  },
  {
    title: "Blade Runner 2049",
    producer: "Denis Villeneuve"
  },
  {
    title: "Speed Racer",
    producer: "Lana & Lilly Wachowski"
  }
];

app.get("/", (req, res) => {
  res.send("Welcome to Movies4U!");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Thats Not Right!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
