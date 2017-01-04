// load up the user model
var User       = require('../models/user');

var configAuth = require('./auth');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

module.exports =  {
    getData: function(user) {
        var data = []
        console.log("getData Token: " + user.google.token)
        console.log("getData spreadsheetId: " + user.google.spreadsheetId)
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
              console.log('The API returned an error: ' + err);
              return;
            }
            var rows = response.values;

            // set all of the relevant information
            user.google.data = rows
            //console.log(rows)

            // save the user
            user.save(function(err) {
                if (err)
                    throw err;
            });
            console.log("7 spreadsheetId: " + user.google.spreadsheetId)
            return user;
        });
    },

     saveSpreadsheetID: function(user, spreadsheetId, callback) {
         console.log("SS SpreadsheetId: " + spreadsheetId)
         console.log("SS user.google.id: " + user.google.id)
         // try to find the user based on their google id

          console.log("1")
          User.findOne({ 'google.id' : user.google.id }, function(err, user) {
                  console.log("4:" + user.google.spreadsheetId)
              if (err)
                  return done(err);

              if (user) {
                  // set all of the relevant information
                  console.log("SS before: " + spreadsheetId)
                  user.google.spreadsheetId = spreadsheetId
                  console.log("SSafter: " + user.google.spreadsheetId)

                  // save the user
                  user.save(function(err) {
                      if (err)
                          throw err;
                  });
              console.log("SS Returning: " + user.google.spreadsheetId)
              console.log("5:" + user.google.spreadsheetId)
              console.log("5:" + user.google.token)
              return callback(user);
              } else {
                  // if a user is not found, redirect to the login screen
                  console.log("SS FAIL MESSAGE");
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
              console.log('Columns:');
              for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                for (var j = 0; j < row.length; j++) {
                //    console.log('%s', row[j]);
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
