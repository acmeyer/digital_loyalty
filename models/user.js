var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  name: { first: String, last: String },
  password: { type: String, required: true },
  phone_number: String, // require if 'Customer' role?
  walletAddress: String,
  role: { type: String, default: "Customer" },
  accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }]
}, { timestamps: true });

// Password management
UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

// Name management
UserSchema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});

UserSchema.virtual('name.full').set(function (name) {
  var split = name.split(' ');
  this.name.first = split[0];
  this.name.last = split[1];
});

module.exports = mongoose.model('User', UserSchema);