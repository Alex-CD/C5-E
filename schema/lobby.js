const mongoose = require("mongoose");
/////////////
// Players //
/////////////

const playerSchema = new mongoose.Schema({
    playerID: {type: String},
    sessionID: {type: String},
    civName: {type: String, required: true}
});

/////////////
// Lobbies //
/////////////

const lobbySchema = new mongoose.Schema({
    lobbyID: {type: String, required: true},
    players: [playerSchema],
    creationDate: {type: Date, default: Date.now},
    inProgress: {type: Boolean, default: false}
});

/////////////
// Exports //
/////////////

module.exports.lobby = mongoose.model('lobby', lobbySchema);
module.exports.player = mongoose.model('player', playerSchema);