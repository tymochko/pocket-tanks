const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');


const rmDir =(dirPath) => {
    let files = fs.readdirSync(dirPath);
    if (files.length > 0)
        for (let i = 0; i < files.length; i++) {
            let filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
        }
};

const checkDir =(dir) => {
    fs.access(dir, (err) => {
        if (err) {
            fs.mkdir(dir);
        }
    });

};


const getSalt =() => {
    return "?salt=" + new Date().getTime();
};
module.exports.checkDir = checkDir;
module.exports.rmDir = rmDir;
module.exports.getSalt = getSalt;