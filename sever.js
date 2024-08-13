// app.js
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MONGO_URI = process.env.MONGO_URI;
const path = require('path');
const Bunny = require('./models/bunny');
const methodOverride = require('method-override');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));



mongoose.connect(process.env.MONGODB_URI); 
mongoose.connection.on("connected", () => {
console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
// Routes
app.get('/', async (req, res) => {
  const bunnies = await Bunny.find();
  res.render('index', { bunnies });
});

app.get('/bunnies', async (req, res) => {
    try {
      const bunnies = await Bunny.find();
      res.render('bunnies/index', { bunnies });
    } catch (err) {
      res.status(500).send('Error fetching bunnies: ' + err);
    }
  });

app.get('/bunnies/new', (req, res) => {
  res.render('new');
});

app.post('/bunnies', async (req, res) => {
  const { name, breed, image } = req.body;
  const newBunny = new Bunny({ name, breed, image });
  await newBunny.save();
  res.redirect('/bunnies');
});

app.get('/bunnies/:id', async (req, res) => {
    try {
      const bunny = await Bunny.findById(req.params.id);
      if (!bunny) return res.status(404).send('Bunny not found');
      res.render('bunnies/show', { bunny });
    } catch (err) {
      res.status(500).send('Error fetching bunny: ' + err);
    }
  });

app.get('/bunnies/:id/edit', async (req, res) => {
  const bunny = await Bunny.findById(req.params.id);
  res.render('bunnies/edit', { bunny });
});

app.put('/bunnies/:id', async (req, res) => {
    try {
      const { name, breed, image } = req.body;
      await Bunny.findByIdAndUpdate(req.params.id, { name, breed, image });
      res.redirect('/bunnies');
    } catch (err) {
      res.status(500).send('Error updating bunny: ' + err);
    }
  });

app.post('/bunnies/:id/delete', async (req, res) => {
  await Bunny.findByIdAndDelete(req.params.id);
  res.redirect('/bunnies');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
