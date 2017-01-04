// load the auth variables
var configAuth = require('../../config/auth');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

function getData(user) {
//function getData(user, spreadsheetId) {
    console.log(spreadsheetId);
    // Generate OAuth
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(configAuth.googleAuth.clientID, configAuth.googleAuth.clientSecret, configAuth.googleAuth.callbackURL);
    oauth2Client.credentials = JSON.parse("{\"access_token\": \"" + user.google.token + "\"}");
    var sheets = google.sheets('v4');
      sheets.spreadsheets.values.get({
          auth: oauth2Client,
        spreadsheetId: '1MUj7FF3DNpsbNppWd2RYluqcz7eTaWWd-Wn67rAL6bQ',
        range: 'B1:1',
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        var rows = response.values;
        if (rows.length == 0) {
          console.log('No data found.');
        } else {
          console.log('Columns:');
          for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            for (var j = 0; j < row.length; j++) {
                console.log('%s', row[j]);
            }
          }
        }
      });
};
