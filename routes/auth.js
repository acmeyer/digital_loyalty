var app = require('../app.js');
var config = require('../config.js');
var jwt = require('jwt-simple');

var User = require('../models/user');
 
var auth = {

  login: function(req, res) {
 
    var username = req.body.username || '';
    var password = req.body.password || '';
 
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    try {
      // Fire a query to the DB and check if the credentials are valid
      User.findOne({
        username: username
      }, function(err, user) {
        if (err) throw err;
        if (!user) {
          res.status(401);
          res.json({ "status": 401, "message": "Authentication failed. User not found."});
        } else if (user) {
          user.comparePassword(password, function(err, isMatch) {
            if (err) throw err;
            if (!isMatch) {
              res.status(401);
              res.json({"status": 401, "message": "Authentication failed. Password is incorrect."});
            } else {
              // If authentication is success, we will generate a token
              // and dispatch it to the client
              res.json(genToken(user));
            }
          })
        }
      });
    } catch (err) {
      res.status(500);
      res.json({
        "status": 500,
        "message": "Oops something went wrong",
        "error": err
      });
    }
  },

  validate: function(req, res, next) {
 
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe. 
   
    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();
   
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
   
    if (token || key) {
      try {
        var decoded = jwt.decode(token, config.secret);
   
        if (decoded.exp <= Date.now()) {
          res.status(400);
          res.json({
            "status": 400,
            "message": "Token Expired"
          });
          return;
        }
   
        // Authorize the user to see if s/he can access our resources
        User.findById(decoded.iss, function(err, user) {
          if (err) throw err;
          if (user) {
            req.user = user;
            switch(user.role) {
              case "Admin":
                next();
                break;
              case "Merchant":
                if (req.url.indexOf('admin') >= 0 || ((req.url.indexOf('/account') < 0 && req.url.indexOf('/me') < 0))) {
                  res.status(403);
                  res.json({
                    "status": 403,
                    "message": "Not Authorized"
                  });
                  return;
                } else {
                  next();
                }
                break;
              case "Customer":
                if (req.url.indexOf('admin') >= 0 || req.url.indexOf('/account') >= 0) {
                  res.status(403);
                  res.json({
                    "status": 403,
                    "message": "Not Authorized"
                  });
                  return;
                } else {
                  next();
                }
                break;
              default:
                res.status(403);
                res.json({
                  "status": 403,
                  "message": "Not Authorized"
                });
                return;
            }
          } else {
            // No user with this id exists
            res.status(401);
            res.json({
              "status": 401,
              "message": "Invalid User"
            });
            return;
          }
        })
   
      } catch (err) {
        res.status(500);
        res.json({
          "status": 500,
          "message": "Oops something went wrong",
          "error": err
        });
      }
    } else {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid Token or Key"
      });
      return;
    }
  }
}

// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    iss: user.id,
    exp: expires
  }, config.secret);
 
  return {
    token: token,
    expires: expires
  };
}
 
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
 
module.exports = auth;