var mongoose = require('mongoose'),
    Movie = mongoose.model('Movie');
// index page
exports.index = function(req, res) {
    res.redirect('/home');
};

// home page
exports.home = function(req, res) {
  console.log('user in session:');
  console.log(req.session.user);

  Movie.fetch(function(err, movies) {
    if(err) {
      console.log(err);
    }

    res.render('index', {
      title: 'cFilm',
      movies: movies
    });
  });
};