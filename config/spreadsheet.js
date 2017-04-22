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
              //console.log(response);
            if (err || !response.range) {
                if (err) {
                    console.log('getData: The SpreadSheet API returned an error: ' + err);
                } else {
                    console.log('getData: The SpreadSheet API did not find values: ' + response);
                }
                cbRenderDashboard("[Error] Spreadsheet ID " + user.google.spreadsheetId + " is invalid. View profile for directions.", user);
                // If invalid spreadsheet, save empty value.
                user.google.spreadsheetId = "";

                // save the user
                user.save(function(err) {
                if (err)
                  throw err;
                });

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
        spreadsheetId = this.parseSpreadsheetId(user, spreadsheetId)
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

      // Definition of Spreadsheet ID
      // https://developers.google.com/sheets/api/guides/concepts
      // Get the ID from the URL or just return what was given
      parseSpreadsheetId: function(user, spreadsheetId)  {
          if (spreadsheetId.startsWith("Invalid:")) {
              return result;
          }
          var result = spreadsheetId;
          var regExpFullID = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)');
          var regExpFullArray = regExpFullID.exec(spreadsheetId);
          if (regExpFullArray && regExpFullArray.length > 1) {
              result = regExpFullArray[1];
          }
          console.log(result)
          return result;
      },

    //   pingSpreadsheet: function(user, spreadsheetId, cbResponse) {
    //       // Generate OAuth
    //       var auth = new googleAuth();
    //       var oauth2Client = new auth.OAuth2(configAuth.googleAuth.clientID, configAuth.googleAuth.clientSecret, configAuth.googleAuth.callbackURL);
    //       oauth2Client.credentials = JSON.parse("{\"access_token\": \"" + user.google.token + "\"}");
    //       var sheets = google.sheets('v4');
    //         sheets.spreadsheets.get({
    //           auth: oauth2Client,
    //           spreadsheetId: spreadsheetId
    //         }, function(err, response) {
    //             console.log("HERE!: " + response);
    //           if (err) {
    //             console.log('[Error] pingSpreadsheet: The SpreadSheet API returned an error: ' + err);
    //             return cbResponse(err, false, spreadsheetId);
    //           }
    //           return cbResponse(err, true, spreadsheetId);
    //       });
    //   },

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
