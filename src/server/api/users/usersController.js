const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: {type: String, required: true, unique: true},
    userEmail: {type: String, required: true, unique: true},
    userPassword: {type: String, required: true},
    userAge: {type: Number, required: true},
    isOnline: {type: Boolean},
    isEnabled: {type: Boolean}
});

module.exports = mongoose.model('User', userSchema);

module.exports.showAll = function (callback) {
    this.find((err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        if (!users) {
            return res.status(404).send('Database is empty');
        }

        callback(err, users);
    });
};

module.exports.showProfile = function (id, callback) {
    this.findOne(id, (err, foundUser) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        if (!foundUser) {
            return res.status(404).send();
        }

        callback(err, foundUser);
    });
};

module.exports.createUser = function (newUser,callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.userPassword, salt, function (err, hash) {
            newUser.userPassword = hash;
            newUser.save(function(err, user){
                if (err) {
                    callback(err);
                } else {
                    callback(null, user);
                }
            });
        });
    });
};

module.exports.loginUser = function (username, password, callback) {
    var User = this;
    User.findOne({userName: username}, (err, user) => {
        if (err)
            callback(err);
        else if (user){
            User.comparePassword(password, user.userPassword, function(err, res) {
                if (err)
                    callback(new Error('Password is incorrect'));
                if (res)
                    User.update({userName: user.userName}, {isOnline: true}, function(err, userNew) {
                        callback(null, user);
                    });
            });
        } else {
            callback(new Error('User is not found'));
        }
    });
};

module.exports.logoutUser = function (id, callback) {
    this.findOneAndUpdate(id, {
            $set: {
                isOnline: false
            }
        },
        {upset: true},
        (err, updatedUser) => {
            if (err) {
                console.log('error occured ' + err);
                return res.status(500).send();
            } else {
                updatedUser.isOnline = false;

                callback(updatedUser);
            }
        });
};

module.exports.updateUser = function (id, updatedData, callback) {
        var User = this;

    if (updatedData.userAge == undefined) {

        User.findOne(id, (err, foundUser) => {
            if (err) {
                callback(err);
            } else if (foundUser){
                User.comparePassword(updatedData.userPassword, foundUser.userPassword, function(err, res) {
                    if (err)
                        callback(new Error('Password is incorrect'));
                    if (res)
                        var newPassword = foundUser.userPassword;
                        console.log('foundUser 1 ', foundUser);
                        User.update({userPassword: newPassword}, function(err, foundUser) {
                            console.log('User.update foundUser 1 ', foundUser);
                            callback(err, foundUser);
                        });
                });
            } else {
                callback(new Error('User is not found'));
            }
        });
    } else {
        User.findOne(id, (err, foundUser) => {
            if (err) {
                console.log('This is error inside ');
                callback(err);
            } else if (foundUser){
                console.log('foundUser 2 ', foundUser);
                User.update({
                    userPassword: foundUser.userPassword
                }, {
                    userName: foundUser.userName
                }, {
                    userAge: foundUser.userAge
                },
                    function(err, foundUser) {
                    console.log('User.update foundUser 2 ', foundUser);
                    callback(err, foundUser);
                });
            } else {
                callback(new Error('User is not found'));
            }
        });
    }
};

module.exports.deleteUser = function (id, callback) {
    this.findOneAndUpdate(id, {
            $set: {
                isEnabled: false,
                isOnline: false
            }
        },
        {upset: true},
        (err, updatedUser) => {
            if (err) {
                console.log('error occured ' + err);
                return res.status(500).send();
            } else {
                updatedUser.isEnabled = false;
                updatedUser.isOnline = false;

                console.log('updatedUser ', updatedUser);
                callback(updatedUser);
            }
        });
};

module.exports.comparePassword = function (candPassword, hash, callback) {
    bcrypt.compare(candPassword, hash, function (err, res) {
        console.log(err, res);
        if (err) throw err;
        callback(null, res);
    });
};