// load the things we need
/*eslint null:0*/
const mongoose = require('mongoose'); //eslint-disable-line null
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

  local: {
    email: String,
    password: String,
    name: String,
  },
  vk: {
    id: String,
    token: String,
    name: String,
  },

});

// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('UserModel', userSchema);
