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
    newGame.save((err, game) => {
        if (err) {
            throw err;
        }
        callback(null, game);
    });
};

const updateGameInfo = function(id, updatedData, callback) {
    this.findOneAndUpdate(
        {_id: id}, {
            $set: {
                player1: updatedData.player1,
                player2: updatedData.player2,
                originalPoints: updatedData.points,
                gameStatus: updatedData.gameStatus
            }
        },
        (err, foundGame) => {
            if (err) {
                throw err;
            } else {
                foundGame.player1 = updatedData.player1;
                foundGame.player2 = updatedData.player2;
                foundGame.originalPoints = updatedData.points;
                foundGame.gameStatus = updatedData.gameStatus;

                callback(err, foundGame);
            }
        });
};

const findGame = function(gameId, callback) {
    this.findOne(gameId, (err, foundGame) => {
        if (err) {
            throw err;
        } else {
            callback(err, foundGame);
        }
    });
};

module.exports.createGame = createGame;
module.exports.updateGameInfo = updateGameInfo;
module.exports.findGame = findGame;
