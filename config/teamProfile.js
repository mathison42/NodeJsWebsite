// load up the team model
var Team       = require('../models/team');

module.exports =  {
  saveProfile: function(userEmail, team, body, cbProfile) {
    // try to find the user based on their google id

    Team.findOne({ 'profile.name' : team.profile.name }, function(err, team) {
        if (err)
            return done(err);
        if (!team || team.profile.admins.includes(userEmail)) {
            if (!team) {
                // if the team isn't in our database, create a new team
                team = new Team();
            }
            // set all of the relevant information
            // Assume it is all valid and vetted beforehand
            team.profile.name          = body.name;
            team.profile.activity      = body.activity;
            team.profile.admins        = body.admins;
            team.profile.private       = body.private;
            team.program.spreadsheetId = body.spreadsheetId;

            // save the user
            team.save(function(err) {
                if (err)
                    throw err;
            });
            return cbProfile(null, team);

        } else {
            // userEmail does not have access to modify this team
            console.log(userEmail + " does not have access to modify team.");
            console.log("Redirecting to login screen...");
        }
     } else {
         // if a team is not found, redirect to the login screen
         console.log("Not logged in. Redirecting to profile screen...");
     }
   });
  }
};
