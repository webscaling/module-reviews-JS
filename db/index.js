const mongoose = require('mongoose');
const atlasKey = require('./config.js');
// const URI = `mongodb+srv://jeffsalinas:${atlasKey}@fec-carousel-xdbvm.mongodb.net/web-scaling?retryWrites=true&w=majority`;

// mongoose.connect(URI, {useNewUrlParser: true});
mongoose.connect('mongodb://localhost:27017/module-reviews', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('SHAZAM! You\'re connected to the db');
});

const itemSchema = new mongoose.Schema({
  reviewID: Number,
  itemID: Number,
  author: String,
  avatarURL: String,
  rating: Number,
  title: String,
  text: String,
  date: Date,
  helpfulCount: Number,
  foundhelpful: Array
});

var Item = mongoose.model('review', itemSchema);

module.exports = Item;