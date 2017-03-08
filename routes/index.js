
var spreadsheet = require("../config/spreadsheet.js")
var mongodb     = require("../config/mongodb.js")
var profile     = require("../config/profile.js")
var youtube     = require("../config/youtube.js")

module.exports = function(app, passport) {

  /* GET home page */
  app.get('/', function(req, res) {
    res.render('dashboard', {
      user : req.user, // get the user out of session and pass to template
      strUser: JSON.stringify(req.user)
    });
  });

  /* POST home page */
  app.post('/', isLoggedIn, function(req, res) {
    var renderDashboard = function(err, user) {
      res.render('dashboard', {
        error : err, // error
        user : user, // get the user out of session and pass to template
        strUser: JSON.stringify(user)
      });
    };

    if (req.body.spreadsheetId){
      spreadsheet.saveSpreadsheetID(req.user, req.body.spreadsheetId,
          spreadsheet.getData, renderDashboard)
    }
    else {
      spreadsheet.getData(req.user, renderDashboard)
    }
  });

  /* GET Team page */
  app.get('/team', isLoggedIn, function(req, res) {
     mongodb.getAllTeamData(req.user, function(error, teamData) {
       if (error) {
         console.log(error);
         return;
       }
       // Note: Double sending user data
       return res.render('team', {
         user : req.user,
         strUser: JSON.stringify(req.user),
         teamData : JSON.stringify(teamData)
       });
     });
  });

  /* GET Lift Page */
  app.get('/lift/:name', function(req, res, next) {
    youtube.getVideos(req.user, req.params.name, function(error, videos) {
      //console.log("videos:", videos);
      if (error) return next(error);
      return res.render('lift', {
        user : req.user, // get the user out of session and pass to template
        strUser: JSON.stringify(req.user),
        lift:  req.params.name,
        videos: videos,
        helpers: require("../public/javascripts/lifts")
      });
    });
  });

  /* GET Profile */
  app.get('/profile', function(req, res) {
    res.render('profile', {
      user : req.user // get the user out of session and pass to template
    });
  });

  /* POST Profile */
  app.post('/profile', isLoggedIn, function(req, res, next) {
    //console.log("req.body", req.body);
    // Variables are in req.body
    // Save them to database, then reload profile with values set as defaults
    profile.saveProfile(req.user, req.body, function(error, updatedUser) {
      if (error) return next(error);
      return res.render('profile', {
        user : updatedUser, // get the new user data
        updatedBool : true
      });
    });
  });

  /* Logout */
  app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
  });
  // =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  app.get('/auth/google', passport.authenticate('google', { scope : [
      'profile',
      'email',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/youtube.readonly']
  }));

  // the callback after google has authenticated the user
  // Updated: Custom callback. Allows to pull data on login
  // http://passportjs.org/docs/authenticate
  app.get('/auth/google/callback', function(req, res, next) {
    passport.authenticate('google', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/'); }
      req.logIn(user, function(err) {
          if (err) { return next(err); }
          // If spreadsheet exists, search for new data on login
          // else show the basic dashboard
          if (user.google.spreadsheetId) {
              return spreadsheet.getData(user, function(err, user) {res.redirect('/');});
          } else {
              return res.redirect('/');
          }
      });
    })(req, res, next);
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/auth/google');
}
