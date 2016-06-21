const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: {type: String, required: true, unique: true},
    userEmail: {type: String, required: true, unique: true},
    userPassword: {type: String, required: true},
    userAge: {type: Number, required: true},
    userImg: {type: Object},
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
            return err;
        }

        if (!foundUser) {
            return err;
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
    User.findOne({userName: username}, (err, foundUser) => {
        if (err) {
            callback(err);
        } else if (foundUser) {

            if (foundUser.isEnabled === false) {
                console.log('This user is deleted');
                return callback(err);

            } else {
                User.comparePassword(password, foundUser.userPassword, function(err, res) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send();
                    }

                    if (res) {
                        updateUser(foundUser);
                    }
                });
            }
        } else {
            callback(new Error('User is not found'));
        }
    });

    const updateUser = (foundUser) => {
        User.update({userName: foundUser.userName}, {isOnline: true}, function (err) {
            if (err) {
                console.log('err ', err);
                return res.status(401).send();
            } else {
                callback(err, foundUser);
            }
        });
    }
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

    User.findOne(id, (err, foundUser) => {
        if (err) {
            callback(err);
        } else if (foundUser) {
            if (updatedData.userOldPassword) {

                User.comparePassword(updatedData.userOldPassword, foundUser.userPassword, function (err) {
                    if (err) {
                        return callback(new Error('Password is incorrect'));
                    }

                    if (updatedData.userNewPassword !== updatedData.userConfPassword) {
                       return callback(err);
                    }

                    updateUser(updatedData, foundUser, callback);
                });
            } else {
                User.update({
                    userName: foundUser.userName,
                    userAge: foundUser.userAge
                }, {
                    userName: updatedData.userName,
                    userAge: updatedData.userAge
                    },
                
                    function(err, foundUser) {
                        callback(err, foundUser);
                    });
            }
        } else {
            callback(new Error('User is not found'));
        }
    });

    const updateUser = (updatedData, foundUser, callback) => {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(updatedData.userConfPassword, salt, function (err, hash) {
                updatedData.userConfPassword = hash;

                User.update({
                        userPassword: foundUser.userPassword,
                        userName: foundUser.userName,
                        userAge: foundUser.userAge
                    }, {
                        userPassword: updatedData.userConfPassword,
                        userName: updatedData.userName,
                        userAge: updatedData.userAge
                    },

                    function (err, foundUser) {
                        callback(err, foundUser);
                    });
            });
        });
    };
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

                callback(err, updatedUser);
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