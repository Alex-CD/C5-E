

module.exports.getLobby = function getLobby(collection, lobbyID, res){
    collection.findOne({lobbyID: lobbyID}).then(lobby=>{
        res.send(lobby);
    });
};