// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs'); 

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://192.168.43.60:27017/ponds', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const pondSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  pondType: String,
  depth: String,
  area: String,
  quantity: String,
  feedType: String,
  lastTestDate: String,
  whichTest: String,
});

const Pond = mongoose.model('Pond', pondSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  try {
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user == null) return res.status(400).send('Cannot find user');

  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ id: user._id }, 'your_jwt_secret');
      res.json({ accessToken });
    } else {
      res.status(403).send('Invalid credentials');
    }
  } catch {
    res.status(500).send();
  }
});

app.get('/ponds', authenticateToken, async (req, res) => {
  try {
    const ponds = await Pond.find({ userId: req.user.id });
    res.json(ponds);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/ponds', authenticateToken, async (req, res) => {
  const newPond = new Pond({ ...req.body, userId: req.user.id });
  try {
    const savedPond = await newPond.save();
    res.json(savedPond);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/ponds/:id', authenticateToken, async (req, res) => {
  try {
    const pond = await Pond.findOne({ _id: req.params.id, userId: req.user.id });
    if (!pond) return res.status(404).send('Pond not found');

    const updatedPond = await Pond.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPond);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/ponds/:id', authenticateToken, async (req, res) => {
  try {
    const pond = await Pond.findOne({ _id: req.params.id, userId: req.user.id });
    if (!pond) return res.status(404).send('Pond not found');

    await Pond.findByIdAndDelete(req.params.id);
    res.send('Pond deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
