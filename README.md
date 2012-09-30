About
=====

Install
=======
npm install mongoose-sluggable-behavior

Usage
=====
    var mongoose = require('mongoose'),
        sluggableBehavior = require('mongoose-sluggable-behavior');

    var routeSchema = new mongoose.Schema({
      name: String,
      location: String
    });

    var db = mongoose.createConnection('localhost', 'models');

    db.once('open', function() {
      var ClimbingRoute = sluggableBehavior('ClimbingRoute', routeSchema, {
        fields: [
          'name',
          'location'
        ]
      });

      var routeOne = new ClimbingRoute({
        name: "High Exposure",
        location: "Gunks"
      });
      routeOne.save();
      /**
       * routeOne.slug => 'high-exposure-gunks'
       */

      var routeTwo = new ClimbingRoute({
        location: "Gunks",
        name: "High Exposure"
      });
      routeTwo.save();
      /**
       * routeTwo.slug => 'high-exposure-gunks-1'
       */
    });
