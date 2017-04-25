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
            team.profile.admins        = []
            team.profile.teammates     = []
            team.profile.private       = body.private;
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

    /**
     * param cb Callback
     * return Return list of all public teams
     */
    getPublicTeamList: function(cb) {
        // Find all teams that are not private
        Team.find({ 'profile.private' : false }, function(err, teams) {
            if (err)
              return done(err);
            var fullPublicTeamResult = []
            if (teams) {
                for(var i = 0; i < teams.length; i++) {
                    var team = teams[i]
                    fullPublicTeamResult.push(team.profile.name);
                };
            } else {
                // if team is not found, record
                console.log("Could not find any public teams...");
            }
            return cb(null, fullPublicTeamResult);
        });
      },

      /**
       * param teamName The team's name
       * param cb Callback
       * return Run the callback with the team profile
       */
      getTeam: function(teamName, cb) {
          // try to find the team based on the team's name
          console.log(teamName)
          if (teamName) {
              Team.findOne({ 'profile.name' : teamName }, function(err, team) {
                  if (err)
                    return done(err);

                  if (team) {
                      return cb(null, team);
                  } else {
                      // if team is not found, record
                      console.log("Team " + teamName + " does not exist...");
                      return cb(null, null);
                  }
              });
          } else {
              return cb(null, new Team());
          }
      },

      /**
       * param user The teammate's user profile who wants to get a list of teammates
       * param teamName The team's name
       * param cb Callback
       * return Run the callback with the teammate array
       */
      getTeammates: function(user, teamName, cb) {
          // try to find the user based on their google id
          this.getTeam(teamName, function(err, team) {
              if (err)
                return done(err);
              if (team) {
                  var teammates = team.profile.teammates;
                  if (teammates.includes(user.google.email)) {
                      return cb(teammates);
                  } else {
                      console.log(user.google.email + " is not a member of team " + teamName);
                      return cb(null);
                  }
              } else {
                  console.log("Could not find team " + teamName);
                  return cb(null);
              }
          });
      },

      /**
       * param user The admin's user profile who wants to get a list of teammates
       * param teamName The team's name
       * param cb Callback
       * return Run the callback with the admin array
       */
      getAdmins: function(user, teamName, cb) {
          // try to find the user based on their google id
          this.getTeam(teamName, function(err, team) {
              if (err)
                return done(err);
              if (team) {
                  var admins = team.profile.admins;
                  if (admins.includes(user.google.email)) {
                      return cb(admins);
                  } else {
                      console.log(user.google.email + " is not an admin of team " + teamName);
                      return cb(null);
                  }
              } else {
                  console.log("Could not find team " + teamName);
                  return cb(null);
              }
          });
      }
};
