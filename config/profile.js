// load up the user model
var User       = require('../models/user');

module.exports =  {
  saveProfile: function(user, body, cbProfile) {
    // try to find the user based on their google id

    User.findOne({ 'google.id' : user.google.id }, function(err, user) {
      if (err)
         return done(err);

      if (user) {
         // set all of the relevant information
         user.profile.activity    = body.activity;
         user.profile.team        = body.team;
         user.profile.maxDashDays = body.maxDashDays;

         // save the user
         user.save(function(err) {
           if (err)
             throw err;
         });
         return cbProfile(null, user);
     } else {
         // if a user is not found, redirect to the login screen
         console.log("Not logged in. Redirecting to login screen...");
     }
   });
  }
};
