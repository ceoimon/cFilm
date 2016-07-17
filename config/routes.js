var Index = require('../app/controllers/index'),
    User = require('../app/controllers/user'),
    Movie = require('../app/controllers/movie'),
    Comment = require('../app/controllers/comment');
// var Comment = require('../app/controllers/comment')
// var Category = require('../app/controllers/category')

module.exports = function(app) {

  // pre handle user
  app.use(function(req, res, next) {
    var _user = req.session.user;

    app.locals.user = _user;

    return next();
  });

  // Index
  app.get('/', Index.index);
  app.get('/home', Index.home);

  // Movie
  app.get('/movie/:id', Movie.detail);
  app.post('/admin/movie/record', User.adminRequired, Movie.record);
  app.get('/admin/list', User.adminRequired, Movie.list);
  app.get('/admin/movie', User.adminRequired, Movie.changeOrNew);
  app.delete('/admin/list', User.adminRequired, Movie.remove);

  // User
  app.get('/admin/userlist', User.adminRequired, User.list);
  app.post('/user/signup', User.notSigninRequired, User.signup);
  app.post('/user/signin', User.notSigninRequired, User.signin);
  app.get('/user/signup', User.unValidation);
  app.get('/logout', User.logout);

  //Comment
  app.post('/user/comment', User.signinRequired, Comment.post);
};