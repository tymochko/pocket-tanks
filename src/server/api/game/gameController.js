const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var gameInfo = new Schema({
    player1: {type: Object},
    player2: {type: Object},
    originalPoints: {type: Array },
    gameStatus: {type: Boolean}
});
module.exports = mongoose.model('Game', gameInfo);

const createGame = function(newGame, callback) {
    console.log('CREATE GAME');

    newGame.save(function (err, game) {
        if (err) {
            return callback(err);
        }
        callback(null, game);
    });
};

const updateGameInfo = function(id, updatedData, callback) {
    var Game = this;

    Game.findOne({_id: id}, (err, foundGame) => {
        if (err) {
            callback(err);
        } else if (foundGame) {
            console.log(foundGame, 'foundGame');
            console.log(updatedData, 'updatedData');
            Game.update({
                    // player1: foundGame.player1,
                    // player2: foundGame.player2,
                    // originalPoints: foundGame.originalPoints,
                    gameStatus: foundGame.gameStatus
                }, {
                    // player1: updatedData.player1,
                    // player2: updatedData.player2,
                    // originalPoints: updatedData.points,
                    gameStatus: updatedData.gameStatus
                },
                (err, foundGame) => {
                    console.log(foundGame, 'foundGame');
                    callback(err, foundGame);
                });
        }
    });
};

const findGame = function(gameId, callback) {
    this.findOne(gameId, (err, foundGame) => {
        if (err) {
            console.log(err);
            return err;
        }

        if (!foundGame) {
            console.log(err, 'err');
            return err;
        }

        callback(err, foundGame);
    });
};

module.exports.createGame = createGame;
module.exports.updateGameInfo = updateGameInfo;
module.exports.findGame = findGame;
