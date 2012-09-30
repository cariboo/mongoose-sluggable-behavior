mongoose-sluggable-behavior
===========================
  This module aims to provide a concurrency safe, lightweight, and simple-to-use sluggable behavior to
  your Mongoose schemas in Node. Simply:

    1) create your schema (without the slug field), and
    2) get your model model with:

    var db = mongoose.createConnection('localhost', 'models');
    db.once('open', function() {
      var Model = sluggableBehavior('ModelName', schema, { fields: ['sluggable1', 'sluggable2', etc.  ]}).model(db);
    });

  This module provides a drop-in replacement for save that will catch a unique
  field error on save if the field is the document's slug. If the slug is a duplicate,
  the behavior will append a counting variable to the end. Subsequent duplicates
  will be saved as:

    slug
    slug-1
    slug-2
    slug-3
    etc.

Install
=======
    npm install mongoose-sluggable-behavior

Example
=======
    var mongoose = require('mongoose'),
        sluggableBehavior = require('mongoose-sluggable-behavior');

    var routeSchema = new mongoose.Schema({
      name: String,
      location: String
    });
    var sluggableSchema = sluggableBehavior('ClimbingRoute', routeSchema, {
      fields: [
        'name',
        'location'
      ]
    })

    var db = mongoose.createConnection('localhost', 'demo');

    db.once('open', function() {
      var ClimbingRoute = sluggableSchema.model(db);

      var routeOne = new ClimbingRoute({
        name: "High Exposure",
        location: "Gunks"
      });
      var routeTwo = new ClimbingRoute({
        location: "Gunks",
        name: "High Exposure"
      });

      routeOne.save(function(err) {
        console.log("Route One: " + routeOne.slug);     // 'Route One: high-exposure-gunks'

        // Save route 2 after we know route 1 has been saved
        routeTwo.save(function(err) {
          console.log("Route Two: " + routeTwo.slug);   // 'Route Two: high-exposure-gunks-1'
        });
      });

    });


Dependencies
============

 * mongoose - "~3.1.2"
 * slugs - "~0.1.2"
