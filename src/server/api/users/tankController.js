const mongoose = require('mongoose');


const gameInfo = new Schema({
    idGame: {type: Number, required: true, unique: true},
    player1: {type: Object},
    // {
    //     tankX: {type: Number, required: true, unique: true},
    //     tankY: {type: Number, required: true, unique: true},
    //     bulletX: {type: Number, required: true, unique: true},
    //     bulletY: {type: Number, required: true, unique: true},
    //     weaponX: {type: Number, required: true, unique: true},
    //     weaponY: {type: Number, required: true, unique: true},
    //     weaponAngle: {type: Number, required: true, unique: true}
    // },
    player2:{type:Object},
    originalPoints:{type : Array },


});
module.exports = mongoose.model('Game', gameInfo);



const createGame = function (newGame, callback) {

        newGame.save(function (err, game) {
            if (err) {
                return callback(err);
            }
            callback(null, game);
        });
};



const updateGameInfo = function (id, updatedData, callback) {
    var Game = this;

    Game.findOne(id, (err, foundGame) => {
        if (err) {
            callback(err);
        }
        else if (foundGame) {
            Game.update({
                //     player1: foundGame.player1
                // }, {
                //     player1: updatedData.player1
                player1: foundGame.player1,
                player2: foundGame.player2
            }, {
                player1:updatedData.player1,
                player2:updatedData.player2

            },
                function (err, foundGame) {
                    callback(err, foundGame);
                });
        }
    });
}







module.exports.createGame = createGame;
module.exports.updateGameInfo = updateGameInfo;

