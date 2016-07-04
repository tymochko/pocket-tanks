var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var usersCollection = require('./usersController');
var multer = require('multer');

const userScopeName         = 'userAvatar';
const publicScopeName       = 'public';
const userUploadsScopeName  = 'userUploads';
const publicImgURL          = "/api/users/profile/getImage/" + publicScopeName + '/';
const userImgURL            = '/api/users/profile/getImage/' + userUploadsScopeName + '/';


// get all users in database, for instance in dashboard
router.get('/', (req, res) => {
    usersCollection.showAll((err, users) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            res.json({'users': users, 'sessionId': req.session.user});
        }
    });
});

// get user's info by id, for instance in profile page
router.get('/profile', (req, res) => {
    usersCollection.showProfile({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            var userInfoDTO = {
                userName: foundUser.userName,
                userAge: foundUser.userAge,
                userEmail: foundUser.userEmail
            };
            res.send(userInfoDTO);
        }
    });
});

// log in user
router.post('/login', (req, res) => {
    var loginName = req.body.userName;
    var loginPassword = req.body.userPassword;

    usersCollection.loginUser(loginName, loginPassword, (err, foundUser) => {
        console.log('foundUser ', foundUser);
        if (err) {
            console.log('err  ', err);
            return res.status(401).send();
        } else {
            req.session.user = foundUser._id;
            req.session.username = foundUser.userName;
            res.status(200).send();
        }
    });
});

// log out user
router.post('/logout', (req, res) => {
    usersCollection.logoutUser({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            // req.session.destroy(function(){
            //     res.redirect('/');
            // });
            res.status(204).send(foundUser);
        }
    });
});

// add newUser
router.post('/add', (req, res) => {
    var newUser = new usersCollection();

    newUser.userName = req.body.userName;
    newUser.userAge = req.body.userAge;
    newUser.userEmail = req.body.userEmail;
    newUser.userPassword = req.body.userPassword;
    newUser.isOnline = false;
    newUser.isEnabled = true;

    usersCollection.createUser(newUser, function (err, user) {
        if (err) {
            console.log(err);
            res.status(400);
            res.json({'message': 'This user is already'});
        } else {
            var dir = './src/server/usersInfo/' + user._id;
            fs.mkdirSync(dir);
            console.log(newUser.userEmail);
            usersCollection.handleEmail(newUser.userName, newUser.userEmail);
            req.session.user = user._id;
            req.session.username = user.userName;
            res.status(201);
            res.json({'message': 'User registered'});
        }
    });
});

// edit user profile
router.put('/profile/updateUser', (req, res) => {
    req.body.userImg.image = req.body.userImg.image.split("/").pop().split('?').shift();

    usersCollection.updateUser({_id: req.session.user}, req.body, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            res.status(204).send(foundUser);
        }
    });
});

// delete user
router.put('/profile/delete', (req, res) => {
    usersCollection.deleteUser({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            res.status(204).send(foundUser);
        }
    });
});

//upload user img
router.post('/profile/upload', function (reqvest, res) {
    var d = new Date();
    var originName;
    var fileNameNew = 'userAvatar' + d.getTime();
    var dir = './src/server/usersInfo/' + reqvest.session.user;
    usersCollection.rmDir(dir);
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            originName = file.originalname;

            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, fileNameNew + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
    });
    var upload = multer({ //multer settings
        storage: storage
    }).single('file');

    upload(reqvest, res, function (err) {
        if (err) {

            res.json({error_code: 1, err_desc: err});
            return;
        }
        var extension = originName.split('.')[originName.split('.').length - 1];
        res.json({image: userImgURL + fileNameNew + '.' + extension + getSalt(), uploadedImg: true});
    });
});


router.get('/profile/getImage/:scope/:imageName?', (req, res) => {
    try {
        let scope = req.params.scope;
        switch (scope) {
            case publicScopeName:
                getPublicImage(req, res);
                break;
            case userScopeName:
                getUserImage(req, res);
                break;
            case userUploadsScopeName:
                getUserUploadedImage(req, res);
                break;
        }
    }
    catch (e) {
        console.log(e)
    }
});


router.get('/profile/publicImages', (req, res) => {
    fs.readdir(__dirname + '/../../images/' + '/', function (e, files) {
        if (!e && files.length > 0) {
            var images = [];
            for (var file in files) {
                images.push({image: publicImgURL + files[file] + getSalt(), uploadedImg: false});
            }

            var userId = req.session.user;
            const userDir = __dirname + '/../../usersInfo/' + userId + '/';

            fs.readdir(userDir, function (e, files) {
                console.log(e, files.length > 0);
                if (!e && files.length > 0)
                    images.push({image: userImgURL + files[0] + getSalt(), uploadedImg: true});
                res.send(200, images);
            });
        }
        else
            res.send(404);
    });
});
const getPublicImage =  function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../../images/' + req.params.imageName), function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
}

function getUserImage (req, res) {
    var userId = req.session.user;
    var userImage;
    var userDir;
    usersCollection.showProfile({_id: userId}, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            userImage = foundUser.userImg;
            console.log('userImage  ', userImage);
            if(userImage.uploadedImg) {
                userDir = __dirname + '/../../usersInfo/' + userId + '/' + userImage.image;
            } else {
                userDir = __dirname + '/../../images/' + userImage.image;
            }
            res.sendFile(path.resolve(userDir), function (err) {
                if (err) {
                    console.log('err:  ', err);
                    res.status(403).end();
                }
            });
        }
    });
}

function getUserUploadedImage (req, res) {
    var userId = req.session.user;
    var imageName = req.params.imageName;
    var imageDir = __dirname + '/../../usersInfo/' + userId + '/' + imageName;

    res.sendFile(path.resolve(imageDir), function (err) {
        if (err) {
            console.log('err:  ', err);
            res.status(403).end();
        }
    });
}
function getSalt (){
    return "?salt=" + new Date().getTime();
}


module.exports = router;