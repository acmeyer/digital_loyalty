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
 
    // Fire a query to your DB and check if the credentials are valid
    var user = auth.validate(username, password);
   
    if (!user) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    if (user) {
      // If authentication is success, we will generate a token
      // and dispatch it to the client
      res.json(genToken(user));
    }
 
  },
 
  validate: function(username, password) {
    User.findOne({'username': username, 'password': password}, function(err, user) {
      if (err) return false
      return user
    })
  },
 
  validateUser: function(username) {
    User.findOne({'username': username}, function(err, user) {
      if (err) return false
      return user
    })
  },
}
 
// private method
function genToken(user) {
  var expires = expiresIn(14); // 14 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());
 
  return {
    token: token,
    expires: expires,
    user: user
  };
}
 
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
 
module.exports = auth;