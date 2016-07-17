var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
  title: String,
  cnTitle: String,
  year: String,
  director: [String],
  classification: [String],
  duration: String,
  poster: String,
  stars: [String],
  summary: String,
  trailer: String,
  imdb: {
    id: String,
    url: String,
    score: String
  },
  douban: {
    score: String
  },
  rottentomatoes: {
    popcorn: String,
    tomatoes: [String]
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  },
  _id: String
});

MovieSchema.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

MovieSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb);
  }
};

module.exports = MovieSchema;