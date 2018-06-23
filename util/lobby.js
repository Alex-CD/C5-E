

module.exports.getLobby = function getLobby(collection, lobbyID, res){
    collection.findOne({lobbyID: lobbyID}).then(lobby=>{
        res.send(lobby);
    });
};

module.exports.addPlayer = function addPlayer(collection, params, res,){
    collection.update({lobbyID: params.lobbyID}, {
        $push: {
            playerID: params.playerID,
            playerName: params.playerName,
            civName: params.civName }
    }).next( result => {
            res.status(201).json(req.params);
    });
};