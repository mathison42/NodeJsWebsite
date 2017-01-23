// load up the user model
var User       = require('../models/user');

var configAuth = require('./auth');
var google     = require('googleapis');
var googleAuth = require('google-auth-library');

module.exports =  {
    getData: function(user, cbRenderDashboard) {
        var data = []

        // Generate OAuth
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(configAuth.googleAuth.clientID, configAuth.googleAuth.clientSecret, configAuth.googleAuth.callbackURL);
        oauth2Client.credentials = JSON.parse("{\"access_token\": \"" + user.google.token + "\"}");
        var sheets = google.sheets('v4');
          sheets.spreadsheets.values.get({
            auth: oauth2Client,
            spreadsheetId: user.google.spreadsheetId,
            range: 'A:ZZZ',
          }, function(err, response) {
            if (err) {
              console.log('getData: The SpreadSheet API returned an error: ' + err);
              cbRenderDashboard("[Error] Spreadsheet is invalid. View profile for directions.", user);
              return;
            }
            var rows = response.values;

            // set all of the relevant information
            user.google.data = rows

            // save the user
            user.save(function(err) {
                if (err)
                    throw err;
            });
            cbRenderDashboard(null, user);
        });
    },

   saveSpreadsheetID: function(user, spreadsheetId, cbGetData, cbRenderDashboard) {
     // try to find the user based on their google id

     User.findOne({ 'google.id' : user.google.id }, function(err, user) {
       if (err)
          return done(err);

       if (user) {
          // set all of the relevant information
          user.google.spreadsheetId = spreadsheetId

          // save the user
          user.save(function(err) {
            if (err)
              throw err;
          });
          return cbGetData(user, cbRenderDashboard);
      } else {
          // if a user is not found, redirect to the login screen
          console.log("Not logged in. Redirecting to login screen...");
      }
    });
  },

  getColumns: function(user) {
      var result = [];
      if (user.google.data) {
          // Get all Columns
          var data = user.google.data
          if (rows.length == 0) {
            console.log('No data found.');
          } else {
            for (var i = 0; i < rows.length; i++) {
              var row = rows[i];
              for (var j = 0; j < row.length; j++) {
                  result.push(row[j]);
              }
            }
          }
      }
      else {
          alert("Please login, specify the spreadsheet, and import data!")
      }
      return result;
  }
};
