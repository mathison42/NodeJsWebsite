// load up the team model
var Team       = require('../models/team');

module.exports =  {
  saveProfile: function(userEmail, body, cb) {
    // try to find the user based on their google id

    Team.findOne({ 'profile.name' : body.name }, function(err, team) {
        if (err)
            return done(err);

        console.log(team);
        //console.log(team.profile.admins);
        console.log(userEmail);

        if (!team || team.profile.admins.includes(userEmail)) {
            if (!team) {
                // if the team isn't in our database, create a new team
                team = new Team();
            }
            // set all of the relevant information
            // Assume it is all valid and vetted beforehand
            team.profile.name          = body.name;
            team.program.spreadsheetId = body.spreadsheetId;
            team.profile.activity      = body.activity;
            team.profile.admins = []
            team.profile.teammates = []
            var adminCount = 0
            var adminEmail = eval('body.adminEmail'+adminCount);
            console.log(body.adminEmail0)
            console.log(adminEmail)
            console.log('body.adminEmail'+adminCount)
            while(adminEmail != null) {
                console.log('body.adminEmail'+adminCount)
                if (adminEmail != "") {
                    team.profile.admins.push(adminEmail);
                }
                adminCount++;
                adminEmail = eval('body.adminEmail'+adminCount);
            }

            var teammateCount = 0
            var teammateEmail = eval('body.teammateEmail'+teammateCount)
            console.log(body.teammateEmail0)
            console.log(teammateEmail)
            console.log('body.teammateEmail'+teammateCount)
            while(teammateEmail != null) {
                console.log('body.teammateEmail'+teammateCount)
                if (teammateEmail != "") {
                    team.profile.teammates.push(teammateEmail);
                }
                teammateCount++;
                teammateEmail = eval('body.teammateEmail'+teammateCount);
            }

            // team.profile.admins        = [body.adminEmail1, body.adminEmail2,
            //      body.adminEmail3, body.adminEmail4, body.adminEmail5];
            // team.profile.private       = body.private;

            // save the team
            team.save(function(err) {
                if (err)
                    throw err;
            });
            return cb(null, team);

        } else {
            // userEmail does not have access to modify this team
            console.log(userEmail + " does not have access to modify team.");
            return cb(null, null);
        }
   });
  },

  /**
   * param user User profile
   * param cb Callback
   * return Return list all teams the user is a part of and if an admin
   */
  getTeamList: function(user, cb) {
      if (user) {
          // try to find the user based on their google id
          Team.find({ 'profile.teammates' : user.google.email }, function(err, teams) {
              if (err)
                return done(err);
              if (teams) {
                  var fullTeamResult = []
                  for(var i = 0; i < teams.length; i++) {
                      var team = teams[i];
                      var singleTeamResult = []
                      singleTeamResult.push(team.profile.name);
                      // Can't access the isTeamAdmin function
                      if (team.profile.admins.includes(user.google.email)) {
                          singleTeamResult.push(true)
                      } else {
                          singleTeamResult.push(false)
                      }
                      fullTeamResult.push(singleTeamResult);
                  };
                  return cb(null, fullTeamResult);
              } else {
                  // if team is not found, record
                  console.log("User is not a part of any teams...");
                  return cb(null, null);
              }
          });
      } else {
          console.log("getTeamList: No user found...");
          return cb(null, null);
      }
    },
};
