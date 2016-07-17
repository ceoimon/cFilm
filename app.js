var express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    port = process.env.POrt || 3000,
    _ = require('underscore'),
    serveStatic = require('serve-static'),
    bodyParser = require('body-parser'),
    app = express(),
    fs = require('fs'),
    dbUrl = 'mongodb://localhost/cFilm';

var MongoDB = mongoose.connect(dbUrl).connection;

// Connect MongoDB
MongoDB.on('error', function(err) { console.log(err.message); });
MongoDB.once('open', function() {
  console.log("mongodb connection open");
});

// Require models
var models_path = __dirname + '/app/models';
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath);
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath);
      }
    });
};
walk(models_path);


app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'cFilm',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions',
    resave: true,
    saveUninitialized: false
  }),
  cookie: {
    expires: new Date(Date.now() + 300000),
    maxAge: 1000 * 60 * 5 // 5 mins
  }
}));

if('development' === app.get('env')) {
  var morgan = require('morgan');
  app.set('showStackError', true);
  app.use(morgan('tiny'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

require('./config/routes')(app);

app.locals.moment = require('moment');
app.set('port', port);
app.listen(port);
app.use(serveStatic('public'));


// var testData = require('./data/letstest.json');
// testData.forEach(function(data) {
//   var id = data.imdbId[0];
//   var movieObj = data;
//   var _movie;

//   movieObj.title = movieObj.title[0];
//   movieObj.cnTitle = movieObj.cnTitle[0];
//   movieObj.year = movieObj.year[0];
//   movieObj.duration = movieObj.duration[0];
//   movieObj.trailer = movieObj.trailer[0];
//   movieObj.imdb = {};
//   movieObj.imdb.id = movieObj.imdbId[0];
//   movieObj.poster = 'img/poster/full/' + movieObj.imdb.id + '.jpg';
//   delete movieObj.imdbId;
//   movieObj.imdb.url = 'http://www.imdb.com/title/' + movieObj.imdb.id;
//   delete movieObj.imdbUrl;
//   movieObj.imdb.score = movieObj.imdbScore[0];
//   delete movieObj.imdbScore;
//   movieObj.douban = {};
//   movieObj.douban.score = movieObj.doubanScore[0];
//   delete movieObj.doubanScore;
//   movieObj.rottentomatoes = {};
//   movieObj.rottentomatoes.popcorn = movieObj.popcorn[0];
//   delete movieObj.popcorn;
//   movieObj.rottentomatoes.tomatoes = movieObj.tomatoes;
//   delete movieObj.tomatoes;
//   delete movieObj.image_urls;

//   Movie.findById(id, function(err, movie) {
//     if(err) {
//       console.log(err);
//     }

//     if(movie) {
//       _movie = _.extend(movie, movieObj);
//       _movie.save(function(err, movie) {
//         if(err) {
//           console.log(err);
//         }

//       // res.redirect('/movie/' + movie._id);
//       });
//     } else {
//       _movie = new Movie({
//         _id: movieObj.imdb.id,
//         title: movieObj.title,
//         cnTitle: movieObj.cnTitle,
//         director: movieObj.director,
//         classification: movieObj.classification,
//         imdb: {
//           id: movieObj.imdb.id,
//           url: "http://www.imdb.com/title/" + movieObj.imdb.id,
//           score: movieObj.imdb.score,
//         },
//         douban: {
//           score: movieObj.douban.score
//         },
//         rottentomatoes: {
//           tomatoes: movieObj.rottentomatoes.tomatoes,
//           popcorn: movieObj.rottentomatoes.popcorn
//         },
//         trailer: movieObj.trailer,
//         poster: movieObj.poster,
//         stars: movieObj.stars,
//         duration: movieObj.duration,
//         year: movieObj.year,
//         // summary: movieObj.summary
//       });
//       _movie.save(function(err, movie) {
//         if(err) {
//           console.log(err);
//         } else {
//           // console.log("1");
//           // res.redirect('/movie/' + movie._id);
//         }
//       });
//     }
//   });
// });

console.log("cFilm start on port: " + port);
