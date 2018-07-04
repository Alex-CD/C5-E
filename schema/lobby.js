const mongoose = require("mongoose");
/////////////
// Players //
/////////////

const playerSchema = new mongoose.Schema({
    playerID: {type: String, required: true},
    sessionID: {type: String, required: true},
    civName: {type: String, required: true}
});

/////////////
// Lobbies //
/////////////

const lobbySchema = new mongoose.Schema({
    lobbyID: {type: String, required: true},
    players: [playerSchema],
    creationDate: {type: Date, default: Date.now}
});

/////////////
// Exports //
/////////////

module.exports.lobby = mongoose.model('lobby', lobbySchema);
module.exports.player = mongoose.model('player', playerSchema);