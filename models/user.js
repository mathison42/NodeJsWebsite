// app/models/user.js
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    google            : {
        id            : String,
        token         : String,
        email         : String,
        name          : String,
        raw           : String,
        spreadsheetId : String,
        data          : Array
    }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
