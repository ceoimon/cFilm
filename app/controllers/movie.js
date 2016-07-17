var mongoose = require('mongoose'),
    Movie = mongoose.model('Movie'),
    // Category = mongoose.model('Category'),
    Comment = mongoose.model('Comment'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path');

// detail page
exports.detail = function(req, res) {
  var id = req.params.id;
  Movie.findById(id, function(err, movie) {
    if(err) {
      console.log(err);
    }

    Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function(err, comments) {
        console.log(comments);
        res.render('detail', {
          title: 'cFilm - ' + movie.title,
          movie: movie,
          comments: comments
        });
      });
  });
};

// movie record
exports.record = function(req, res) {
  var id = req.body.movie.imdb.id;
  var movieObj = req.body.movie;
  var _movie;

  movieObj.director = movieObj.director.split(',');
  movieObj.classification = movieObj.classification.split(',');
  movieObj.rottentomatoes.tomatoes = movieObj.rottentomatoes.tomatoes.split(',');
  movieObj.stars = movieObj.stars.split(',');

  Movie.findById(id, function(err, movie) {
    if(err) {
      console.log(err);
    }

    if(movie) {
      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie) {
        if(err) {
          console.log(err);
        }

      res.redirect('/movie/' + movie._id);
      });
    }else{
      _movie = new Movie({
        _id: movieObj.imdb.id,
        title: movieObj.title,
        cnTitle: movieObj.cnTitle,
        director: movieObj.director,
        classification: movieObj.classification,
        imdb: {
          id: movieObj.imdb.id,
          url: "http://www.imdb.com/title/" + movieObj.imdb.id,
          score: movieObj.imdb.score,
        },
        douban: {
          score: movieObj.douban.score
        },
        rottentomatoes: {
          tomatoes: movieObj.rottentomatoes.tomatoes,
          popcorn: movieObj.rottentomatoes.popcorn
        },
        trailer: movieObj.trailer,
        poster: movieObj.poster,
        stars: movieObj.stars,
        duration: movieObj.duration,
        year: movieObj.year,
        summary: movieObj.summary
      });
      _movie.save(function(err, movie) {
        if(err) {
          console.log(err);
        } else {
          console.log("1");
          res.redirect('/movie/' + movie._id);
        }
      });
    }
  });
};

// Movie list
exports.list = function(req, res) {
  Movie.fetch(function(err, movies) {
    if(err) {
      console.log(err);
    }

    res.render('list', {
      title: 'cFilm - Backstage Management',
      movies: movies
    });
  });
};

// Movie modify or new create
exports.changeOrNew = function(req, res) {
  var id = req.query.id;
  if(id){
    Movie.findById(id, function(err, movie){
      if(err) {
        console.log(err);
      }
      if(movie) {
        res.render('admin', {
          title: 'cFilm - ' + movie.title,
          movie: movie
        });
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.render('admin', {
      title: 'cFilm - Backstage Recorded',
      movie: {
        title: '',
        cnTitle: '',
        director: [],
        classification: [],
        imdb: {
          id: '',
          url: '',
          score: ''
        },
        douban: {
          score: ''
        },
        rottentomatoes: {
          popcorn: '',
          tomatoes: []
        },
        trailer: '',
        poster: '',
        year: '',
        duration: '',
        stars: [],
        summary: ''
      }
    });
  }
};

// Remove movie
// to do: Batch delete
exports.remove = function(req, res) {
  var id = req.query.id;
  if(id){
    Movie.remove({_id: id}, function(err, movie){
      if(err){
        console.log(err);
      }else {
        res.json({success: 1});
      }
    });
  }
};