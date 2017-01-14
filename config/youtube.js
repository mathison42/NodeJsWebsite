var configAuth = require('./auth');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

module.exports =  {

  // Call two YouTube Get HTTP Calls via Promise
  getVideos: function (user, lift, callback) {

    // Promise for Form Video
    var promiseGetFormVideo = new Promise(function(resolve, reject) {
      getFormVideo(user, lift, resolve, reject);
    });

    // Promise for Other Lift-type video
    var promiseGetOtherVideo = new Promise(function(resolve, reject) {
      getOtherVideo(user, lift, resolve, reject);

    });

    // Once all promises are received, continue
    Promise.all([
        promiseGetFormVideo, promiseGetOtherVideo
    ]).then(function(value) {
      // value contains an array ['cloudy', 'bob', 'meteor rising'] as resolved by the promises
      // console.log('Rendering data');
      // console.log("1)", JSON.stringify(value[0]));
      // console.log("2)", JSON.stringify(value[1]));
      callback(null, value);
    }, function (err) {
      console.log(err); //
      callback(null, null);
    });
  }

};

// Function to get form video
// Random = 5
// Query: $lift workout form
var getFormVideo = function(user, lift, callback, error) {

  var yt = google.youtube('v3');
  var request = yt.search.list({
    auth: initGoogleAuth(user),
    q: lift + " workout form",
    part: 'snippet'
  }, function(err, response) {
    if (err) {
      error('The getFormVideo API returned an error: ' + err);
    }

    var result = response.items[randomNumber(5)];
    //console.log("Full Youtube getFormVideo Query: " + JSON.stringify(response.items));
    //console.log("YouTube getFormVideo Response:" + JSON.stringify(result));
    callback(result);
  });
};

// Function to get other lift-type video
// Random = 5
// Query: other $lift exercises
var getOtherVideo = function(user, lift, callback, error) {
  var yt = google.youtube('v3');
  var request = yt.search.list({
    auth: initGoogleAuth(user),
    q: "other " + lift + " excerises",
    part: 'snippet'
  }, function(err, response) {
    if (err) {
      error('The getOtherVideo API returned an error: ' + err);
    }

    var result = response.items[randomNumber(5)];
    //console.log("Full Youtube getOtherVideo Query: " + JSON.stringify(response.items));
    //console.log("YouTube getOtherVideo Response:" + JSON.stringify(result));
    callback(result);
  });
};

// Initialize the Google Authorization
var initGoogleAuth = function(user) {
  // Generate OAuth
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(configAuth.googleAuth.clientID, configAuth.googleAuth.clientSecret, configAuth.googleAuth.callbackURL);
  oauth2Client.credentials = JSON.parse("{\"access_token\": \"" + user.google.token + "\"}");
  return oauth2Client;
};

// Get random integer from given number
var randomNumber = function(number) {
  if (number > 0) {
    return Math.floor(Math.random() * number);
  }
  return 0;
};
