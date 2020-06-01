module.exports = function(app, passport, db) {
  var ObjectID = require('mongodb').ObjectID

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // ADD SECTION
    app.get('/add', function(req, res) {
      // console.log(req.user._id);

      db.collection('messages').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('addEntry.ejs', {
          user : req.user
        })
      })
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      // console.log({_id: ObjectID(req.user._id)}, {id: req.user._id.toString()})
        db.collection('messages').find({id: req.user._id.toString()} ).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result

          })
        })
    });

    app.get('/date/:date', isLoggedIn, function(req, res) {
      //grabbing the date passed in the url - NEED TO ALTER THIS LATER
      let date = req.url.replace('/date/','')
        //only show entries from this date
        db.collection('messages').find({id: req.user._id.toString(), date: date}).toArray((err, result) => {

          if (err) return console.log(err)
          res.render('date.ejs', {
            user : req.user,
            messages: result

          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/messages', (req, res) => {
      db.collection('messages').save({date: req.body.date, ent: req.body.ent, id: req.body.user}, (err, result) => {
        // console.log(result);
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/messages', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
        $set: {
          thumbUp:req.body.thumbUp + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.put('/messagesDown', (req, res) => {
      console.log(req.body.updateDate, req.body.updateEnt, req.body.entId);
      db.collection('messages')
        .findOneAndUpdate({_id: ObjectID(req.body.entId)}, {
          $set: {
            date: req.body.updateDate,
            ent: req.body.updateEnt


          }
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
      })

    app.delete('/messages', (req, res) => {
      var entId = ObjectID(req.body.entId)
      console.log(req.body.entId);
      db.collection('messages').findOneAndDelete({_id: entId}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
