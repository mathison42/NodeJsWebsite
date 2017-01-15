
var spreadsheet = require("../config/spreadsheet.js")
var youtube = require("../config/youtube.js")
module.exports = function(app, passport) {

  /* GET home page */
  app.get('/', function(req, res) {
    res.render('index', {
      user : req.user, // get the user out of session and pass to template
      strUser: JSON.stringify(req.user)
    });
  });

  /* POST home page */
  app.post('/', isLoggedIn, function(req, res) {
    // console.log("NewData: " + user.google.data);
    var renderDashboard = function(user) {
      res.render('index', {
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

  /* Profile */
  app.get('/profile', function(req, res) {
    res.render('profile', {
      user : req.user // get the user out of session and pass to template
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
  app.get('/auth/google/callback',
    passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
    })
  );

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/auth/google');
}
