var mongoose = require('mongoose'),
    Comment = mongoose.model('Comment');

exports.post = function(req, res) {
  var _comment = req.body.comment;
  var movieId = _comment.movie;

  if(_comment.cid) {
    Comment.findById(_comment.cid, function(err, comment) {
      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      };

      comment.reply.push(reply);

      comment.save(function(err, comment) {
        if(err) {
          console.log(err);
        }

        res.redirect('/movie/' + movieId);
      });
    });
  } else {
    var comment = new Comment(_comment);
    comment.save(function(err, comment) {
      if(err) {
        console.log(err);
      }

      res.redirect('/movie/' + movieId);
    });
  }
};