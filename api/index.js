require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const verifyFirebaseToken = require('../middleware/auth');
const verifyUserUrl = require('../middleware/userUrl');
const fileUploadRoutes = require('../routes/upload');
const photosListRoutes = require('../routes/getPhotosList');
const photoGetByKeyRoutes = require('../routes/getPhotoByKey');
const userRoute = require('../routes/user');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.htm'));
});
app.get('/about', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.htm'));
});
app.get('/([a-z0-9]{16})', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.htm'));
});
app.get('/test', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.htm'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/upload', verifyUserUrl, fileUploadRoutes);
app.use('/api/photos', verifyFirebaseToken, photosListRoutes);
app.use('/api/photo', photoGetByKeyRoutes);


app.use('/api/dupa', (req, res) => {
  console.log('dupa')
  res.json('ok');
});

app.use('/api/user', verifyFirebaseToken, userRoute);

module.exports = app;