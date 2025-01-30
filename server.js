
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());


const db = 'mongodb://localhost:27017/netflix-movies';

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: String,
  description: String,
  genre: String,
  year: Number,
  rating: Number,
  imageUrl: String,
}));


app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    res.json(movie);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const { title, description, genre, year, rating, imageUrl } = req.body;
    const newMovie = new Movie({ title, description, genre, year, rating, imageUrl });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


app.put('/api/movies/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMovie) {
      return res.status(404).send('Movie not found');
    }
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


app.delete('/api/movies/:id', async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).send('Movie not found');
    }
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



