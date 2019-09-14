const Item = require('./index.js');
const Neah = require('neah'); //Arnie quote generator
const neah = new Neah();
const { CensorSensor } = require('censor-sensor'); //Profanity filter
const censor = new CensorSensor();
const dummyData = require('./dummydata');
const timerFn = require('timer-node');
const timer = timerFn('test-timer');


censor.disableTier(4);

const characters = [
  { name: 'Harry Potter', image: 'https://imgix.ranker.com/user_node_img/137/2729278/original/harry-potter-u18?w=87&h=87&fit=crop&crop=faces&q=60&fm=pjpg' },
  { name: 'Hermione Granger', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Hermione_Granger_poster.jpg/220px-Hermione_Granger_poster.jpg' },
  { name: 'Ron Weasley', image: 'https://vignette.wikia.nocookie.net/harrypotter/images/8/83/180px-Ron-Order-of-the-Phoenix-ronald-weasley-4959523-285-428.jpg/revision/latest?cb=20130812162023' },
  { name: 'Scabbers', image: 'http://absfreepic.com/absolutely_free_photos/small_photos/angry-rat-in-nest-2700x1800_100432.jpg' },
  { name: 'Rubeus Hagrid', image: 'https://images.immediate.co.uk/production/volatile/sites/3/2016/11/123909.jpg?quality=90&resize=620,413' },
  { name: 'Frodo Baggins', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Elijah_Wood_as_Frodo_Baggins.png/220px-Elijah_Wood_as_Frodo_Baggins.png' },
  { name: 'Samwise Gamgee', image: 'https://bookriot.com/wp-content/uploads/2018/07/Samwise-Gamgee.jpg' },
  { name: 'Majin Buu', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/Majin-Boo.jpg/250px-Majin-Boo.jpg' },
  { name: 'Doctor Strange', image: 'https://imgix.ranker.com/user_node_img/44/871345/original/doctor-strange-photo-u21?w=87&h=87&fit=crop&crop=faces&q=60&fm=pjpg' },
  { name: 'Prospero', image: 'http://4umi.com/image/book/shakespeare/prospero.jpg' },
  { name: 'Mary Poppins', image: 'https://thenypost.files.wordpress.com/2018/12/122518-mary-poppins2.jpg?quality=80&strip=all&w=618&h=410&crop=1' },
  { name: 'Gandalf', image: 'https://imgix.ranker.com/node_img/53/1042440/original/gandalf-film-characters-photo-1?w=87&h=87&fit=crop&crop=faces&q=60&fm=pjpg' },
  { name: 'Saruman', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/aa/Christopher_Lee_as_Saruman_LOTR.jpg/220px-Christopher_Lee_as_Saruman_LOTR.jpg' },
  { name: 'Albus Dumbledore', image: 'https://upload.wikimedia.org/wikipedia/en/f/fe/Dumbledore_and_Elder_Wand.JPG' },
  { name: 'Minerva McGonagall', image: 'https://i.pinimg.com/originals/d2/3c/77/d23c7786752d929b43be5eb350c3df99.jpg' },
  { name: 'Gob Bluth', image: 'https://imgix.ranker.com/node_img/53/1059539/original/george-oscar-g-o-b-bluth-ii-film-characters-photo-1?w=87&h=87&fit=crop&crop=faces&q=60&fm=pjpg' },
  { name: 'Tom Marvolo Riddle', image: 'https://imgix.ranker.com/user_node_img/74/1471537/original/lord-voldemort-film-characters-photo-u4?w=87&h=87&fit=crop&crop=faces&q=60&fm=pjpg' },
  { name: 'Mickey Mouse', image: 'https://imgix.ranker.com/user_node_img/79/1579031/original/mickey-mouse-comic-book-characters-photo-u3?w=87&h=87&fit=crop&crop=faces&q=60&fm=pjpg' },
  { name: 'Quentin Coldwater', image: 'https://images.8tracks.com/cover/i/012/299/650/Screenshot_16-2095.png?rect=81,0,516,516&q=98&fm=jpg&fit=max' },
  { name: 'Zatanna', image: 'https://imgix.ranker.com/user_node_img/122/2437988/original/zatanna-comic-book-characters-photo-u13?w=87&h=87&fit=crop&crop=faces&q=60&fm=pjpg' },
  { name: 'Thaddeus Bradley', image: 'https://imgix.ranker.com/user_node_img/3683/73653603/original/thaddeus-bradley-fictional-characters-photo-u1?w=87&h=87&fit=crop&crop=faces&q=60&fm=pjpg' },
];

let count = 0;

const seedFakeData = (itemCount) => {
  let array = [];
  for (var i = 1; i <= itemCount; i++) {
    let rating = Math.floor((Math.random() * 5) + 1);
    let itemID = Math.floor((Math.random() * 10000000) + 1);

    let ipsum = censor.cleanProfanityIsh(neah.paragraph());
    let title = censor.cleanProfanityIsh(neah.getRandom());
    title = title.length > 50 ? title.substring(0,50) + '...' : title;

    let helpful = Math.floor((Math.random() * 15) + 1);

    let randYear = Math.floor((Math.random() * 3) + 2017);
    let monthMax = randYear === 2019 ? 7 : 11;
    let randMonth = Math.floor((Math.random() * monthMax) + 1);
    let randDay = Math.floor((Math.random() * 27) + 1);
    let randHours = Math.floor((Math.random() * 24) + 0);
    let randMins = Math.floor((Math.random() * 60) + 0);
    let randDate = new Date(Date.UTC(randYear, randMonth, randDay, randHours, randMins));

    let randChar = characters[Math.floor((Math.random() * characters.length))];

    var singleItem = new Item({
      itemID: itemID,
      author: randChar.name,
      avatarURL: randChar.image,
      rating: rating,
      title: title,
      text: ipsum,
      date: randDate,
      helpfulCount: helpful,
      count: i 
    });
    array.push({insertOne: singleItem});
 
  }
  Item.collection.bulkWrite(array)
    .then(() => {
      console.log('success #' + count);
      if (count < 18) {
        count++;
        seedFakeData(500000);
      } 
    })
    .catch(err => {
      console.error(err);
    });
};


const createRandomItem = (review_ID, itemID, biasRating) => {

  let rating;
  if(biasRating === undefined) {
    rating = Math.floor((Math.random() * 5) + 1);
  } else {
    rating = biasRating;
  }
  //let itemID = Math.floor((Math.random() * 100) + 1);

  let ipsum = censor.cleanProfanityIsh(neah.paragraph());
  let title = censor.cleanProfanityIsh(neah.getRandom());
  title = title.length > 50 ? title.substring(0,50) + '...' : title;

  let helpful = Math.floor((Math.random() * 15) + 1);

  let randYear = Math.floor((Math.random() * 3) + 2017);
  let randMonth = Math.floor((Math.random() * 11) + 1);
  let randDay = Math.floor((Math.random() * 27) + 1);
  let randHours = Math.floor((Math.random() * 24) + 0);
  let randMins = Math.floor((Math.random() * 60) + 0);
  let randDate = new Date(Date.UTC(randYear, randMonth, randDay, randHours, randMins));

  var singleItem = new Item({
      reviewID: review_ID,
      itemID: itemID,
      author: 'testAuth',
      avatarURL: arniePics[review_ID % arniePics.length],
      rating: rating,
      title: title,
      text: ipsum,
      date: randDate,
      helpfulCount: helpful,
      foundHelpful: []
  });

  return singleItem;

}

module.exports = { seedFakeData };