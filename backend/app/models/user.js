var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    }
})

// methods ======================
// generating a hash
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema)
