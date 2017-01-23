
// load up the user model
var User       = require('../models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = {

  getAllData: function(user, cb) {
    User.find({}, function(err, users) {
    //User.findOne({ 'google.id' : {$ne:user.google.id} }, function(err, users) {
      if (err) return done(err);

      console.log("users: ", JSON.stringify(users));
      var team = {};
      if (users) {
        for (var i = 0; i < users.length; i++) {
          team[users[i].google.name] = users[i].google.data;
        }
      }
      if (team) {
        return cb(null, team);
      // } else if(user.google.id && !team) {
      //   console.log("Sorry. You have no teammates.");
      //   return cb(null, team);
      } else {
        // if a user is not found, redirect to the login screen
        console.log("Not logged in. Redirecting to login screen...");
      }
    });
  }
}
