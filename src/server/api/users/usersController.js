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

const showAll = function (callback) {
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

const showProfile = function (id, callback) {
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

const passHash = (userPassword, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(userPassword, salt, (err, hash) => {
            callback(err, hash);
        });
    });
};

const createUser = function (newUser, callback) {
    passHash(newUser.userPassword, (err, hash) => {
        if (err) {
            return callback(err);
        }

        newUser.userPassword = hash;
        newUser.save(function(err, user){
            if (err) {
                return callback(err);
            }
            callback(null, user);
        });
    });
};

const comparePassword = (candPassword, hash, callback) => {
    bcrypt.compare(candPassword, hash, function (err, res) {
        console.log(err, res);
        if (err) throw err;
        callback(null, res);
    });
};

const loginUser = function (username, password, callback) {
    var User = this;
    User.findOne({userName: username}, (err, foundUser) => {
        if (err) {
            callback(err);
        } else if (foundUser) {

            if (foundUser.isEnabled === false) {
                return callback(new Error('Sorry, this user is deleted'));

            } else {
                comparePassword(password, foundUser.userPassword, function(err, res) {
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
                var foundUserEnter = {
                    userName: foundUser.userName,
                    userAge: foundUser.userAge,
                    userImg: foundUser.userImg,
                    userEmail: foundUser.userEmail,
                    _id: foundUser._id
                };
                callback(err, foundUserEnter);
            }
        });
    }
};

const logoutUser = function (id, callback) {
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

const updateUser = function (id, updatedData, callback) {
    var User = this;

    User.findOne(id, (err, foundUser) => {
        if (err) {
            callback(err);
        } else if (foundUser) {
            if (updatedData.userOldPassword) {

                comparePassword(updatedData.userOldPassword, foundUser.userPassword, function (err) {
                    if (err) {
                        return callback(new Error('Password is incorrect'));
                    }

                    if (updatedData.userNewPassword !== updatedData.userConfPassword) {
                        return callback(new Error('Confirmed password does not match'));
                    }

                    if (updatedData.userNewPassword == null || undefined) {
                        return callback(new Error('Old password is entered but new password is not set'));
                    }

                    console.log('updatedData ', updatedData);
                    updateUser(updatedData, foundUser, callback);
                });
            } else {
                User.update({
                    userName: foundUser.userName,
                    userAge: foundUser.userAge,
                    userImg: foundUser.userImg
                }, {
                    userName: updatedData.userName,
                    userAge: updatedData.userAge,
                    userImg: updatedData.userImg
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
        passHash(updatedData.userConfPassword, function (err, hash) {
            updatedData.userConfPassword = hash;

            User.update({
                    userPassword: foundUser.userPassword,
                    userName: foundUser.userName,
                    userAge: foundUser.userAge,
                    userImg: foundUser.userImg
                }, {
                    userPassword: updatedData.userConfPassword,
                    userName: updatedData.userName,
                    userAge: updatedData.userAge,
                    userImg: updatedData.userImg
                },

                function (err, foundUser) {
                    callback(err, foundUser);
                });
        });
    };
};

const deleteUser = function (id, callback) {
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

module.exports.showAll = showAll;
module.exports.showProfile = showProfile;
module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;