var configAuth = require('./auth');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

module.exports =  {
    getFormVideo: function(user, lift, callback) {
        console.log("getFormVideo lift0: " + lift)
        var out
        var random = this.randomNumber(5);
        var yt = google.youtube('v3');
        var request = yt.search.list({
            auth: this.initGoogleAuth(user),
            q: lift + " workout form",
            part: 'snippet'
        }, function(err, response) {
            if (err) {
              console.log('The API returned an error: ' + err);
              return;
            }
            console.log("RandomNumber: " + random);
            console.log("Full Youtube Query: " + JSON.stringify(response.items));
            console.log("Youtube Query: " + JSON.stringify(response.items[random]));
            out = response.items[random];
            console.log("YouTube RESPONSE0:" + out);
            callback(null, out);
        });
    },

    initGoogleAuth: function(user) {
      // Generate OAuth
      var auth = new googleAuth();
      var oauth2Client = new auth.OAuth2(configAuth.googleAuth.clientID, configAuth.googleAuth.clientSecret, configAuth.googleAuth.callbackURL);
      oauth2Client.credentials = JSON.parse("{\"access_token\": \"" + user.google.token + "\"}");
      return oauth2Client;
    },

    randomNumber: function(number) {
      if (number > 0) {
        return Math.floor(Math.random() * number);
      }
      return 0;
    }
};
