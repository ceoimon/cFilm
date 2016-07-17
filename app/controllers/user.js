var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.signinRequired = function(req, res, next) {
  var _user = req.session.user;
  if(!_user) {
    return res.sendStatus(404);
  } else {
    next();
  }
};

exports.notSigninRequired = function(req, res, next) {
  var _user = req.session.user;
  if(_user) {
    return res.sendStatus(404);
  } else {
    next();
  }
};

exports.adminRequired = function(req, res, next) {
  var _user = req.session.user;
  if(!_user || _user.role !== 99) {
    return res.sendStatus(404);
  } else {
    next();
  }
};

// User list
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if(err) {
      console.log(err);
    }
    res.render('userlist', {
      title: 'cFilm - Users Management',
      users: users
    });
  });
};

// Sign up
exports.signup = function(req, res) {
  var USERNAMEPATTERN = /^[a-zA-z][a-zA-Z0-9_]{3,11}$/ ;
  var _user = req.body.user;

  if(_user && _user.name && _user.password) {
    if(USERNAMEPATTERN.test(_user.name)) {
      User.findOne({name: _user.name}, function(err, user) {
        if(err) {
          console.log(err);
          res.redirect('/');
        }
        console.log(!!user)
        console.log(user)
        if(user) {
          res.redirect('/');
          return
        }
        var user = new User(_user);
        user.save(function(err, user) {
          if(err) {
            console.log(err);
            res.redirect('/');
          }
          console.log('Sign up successed.');
          res.redirect('/admin/userlist');
        });
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
};

// Sign up username validation
exports.unValidation = function(req, res) {
  var userName = req.query.name;
  if(userName) {
    User.find({name: userName}, function(err, user) {
      if(err) {
        console.log(err);
      }

      if(user[0]) {
        res.json({success: 0});
      } else {
        res.json({success: 1});
      }
    });
  }
};

// Sign in
exports.signin = function(req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne({name: name}, function(err, user) {
    if(err) {
      console.log(err);
      res.redirect('/');
    }
    if(!user) {
      console.log('User ' + name + ' do not exist.');
      res.redirect('/');
    } else {
      user.comparePassword(password, function(err, isMatch) {
        if(err) {
          console.log(err);
          res.redirect('back');
        }
        if(isMatch) {
          req.session.user = user;
          console.log('User ' + name + ' sign in successed.');
          res.redirect('back');
        } else {
          console.log('User ' + name + ' sign in failed, password wrong.');
          res.redirect('back');
        }
      });
    }
  });
};

// Log out
exports.logout = function(req, res) {
  delete req.session.user;
  // delete app.locals.user;

  console.log('Log out successed.');
  res.redirect('back');
};
