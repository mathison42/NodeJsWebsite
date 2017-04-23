// app/models/team.js
var mongoose = require('mongoose');

// define the schema for our team model
var teamSchema = mongoose.Schema({

    profile           : {
      activity        : String,
      name            : String,
      admins          : Array,
      teammates       : Array,
      private         : Boolean
    },
    program           : {
        spreadsheetId : String,
        data          : Array
        //hash          : Number
    }
});

// create the model for teams and expose it to our app
module.exports = mongoose.model('Team', teamSchema);
