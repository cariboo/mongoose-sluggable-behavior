var mongoose = require('mongoose');
var slugs = require('slugs');

module.exports = function(name, schema, options) {

  schema.add({
    slug: {
      type: String,
      unique: true
    }
  });

  schema.methods.makeSlug = function(suffix) {
    var self = this;

    var slug = [];
    options.fields.forEach(function(field) {
      if (self[field] !== undefined) {
        slug.push(self[field]);
      }
    });

    if (suffix !== undefined) {
      slug.push(suffix);
    }

    return slugs(slug.join(' '));
  };

  schema.pre('save', function(next) {
    if (this.slug === undefined) {
      this.slug = this.makeSlug();
    }

    next();
  });

  return function(db) {
    var Model = db.model(name, schema);

    Model.prototype.save = function(callback, slug_counter) {
      var obj = this;
      slug_counter = slug_counter || 1;

      mongoose.Model.prototype.save.call(obj, function(err) {
        if (err && (err.code === 11000) && (err.err.indexOf(obj.slug) !== -1)) {
          obj.slug = obj.makeSlug(slug_counter);
          Model.prototype.save.call(obj, callback, slug_counter + 1);
        } else {
          callback(err);
        }
      });
    };

    return Model;
  };
};
