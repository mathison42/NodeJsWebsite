var configAuth = require('./auth');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

module.exports =  {
    getFormVideo: function(user, lift) {
        console.log("getFormVideo lift0: " + lift)
        var out
        // Generate OAuth
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(configAuth.googleAuth.clientID, configAuth.googleAuth.clientSecret, configAuth.googleAuth.callbackURL);
        oauth2Client.credentials = JSON.parse("{\"access_token\": \"" + user.google.token + "\"}");
        var yt = google.youtube('v3');
        console.log("getFormVideo lift1: " + lift)
        var request = yt.search.list({
            auth: oauth2Client,
            q: "ultimate frisbee",
            part: 'snippet'
        }, function(err, response) {
            if (err) {
              console.log('The API returned an error: ' + err);
              return;
            }
            out = JSON.stringify(response.items[0]);
            console.log("YouTube RESPONSE0:" + out);
            return out;
        });
        console.log("getFormVideo lift2: " + lift)
    }
};
