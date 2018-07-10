
//////////////////////
// Exported Methods //
//////////////////////

module.exports.createLobby = function createLobby(params, schema, res){
    lobbyNotExists(params.lobbyID, res, schema, ()=>{
        const lobby = new schema.lobby({lobbyID: params['lobbyID']});
        lobby.save( err => { console.log(err)});


        return res.status(201).json(params);
    })
};




module.exports.getLobby = function getLobby(params, res, schema){

    schema.lobby.find({ lobbyID: params.lobbyID }, (err, lobbies) => {
        if(lobbies.length > 0){
            res.send(lobbies[0]);
        }
        else{
            return res.status(409).json({errors: "Lobby does not exist."})
        }
    });

};



module.exports.addPlayer = function addPlayer(lobbyID, playerID, civName, sessionID, res, schema, pusher){
    schema.player.create({playerID: playerID, sessionID: sessionID, civName: civName }, (err, toAdd )=>{
        if (err) {
            console.log(err);
            res.write(err);
        }


        schema.lobby.findOneAndUpdate({ lobbyID: lobbyID}, {$push: { players: toAdd }}, (err)=> {
                if (err) {
                    console.log(err);
                    res.write(err);
                }

                // Notifying clients of lobby change
                pusher.trigger(lobbyID+"-lobby", 'state-update', {});

                res.status(201).json(lobbyID);
            }
        );
    });
};


module.exports.removePlayer = function removePlayer(lobbyID, sessionID, res, schema, pusher){
    lobbyExists(lobbyID, res, schema, ()=>{
        schema.lobby.findOneAndUpdate({ lobbyID: lobbyID },
            {$pull: {players: { sessionID: sessionID}}},
            (err) => {
                if(err){
                    console.log(err);
                    res.status(404).json({ errors: err.mapped()});
                }

                // Notifying clients of lobby change
                pusher.trigger(lobbyID+"-lobby", 'state-update', {});

                res.status(201).json(lobbyID)
            });})
};


module.exports.startGame = function startGame(lobbyID, sessionID, res, schema, pusher){
    schema.lobby.findOneAndUpdate({ lobbyID: lobbyID}, { inProgress: true },
        (err) => {
            if (err) {
                console.log(err);
                res.status(404).json({errors: err.mapped()});
            }

            // Notifying clients
            pusher.trigger(lobbyID+"-lobby", 'game-start', {});

            res.status(201).json(lobbyID);
        })
};

//////////////////////
// Internal methods //
//////////////////////


function lobbyExists(lobbyID, res, schema, callback){
    schema.lobby.find({ lobbyID: lobbyID }, (err, lobbies) => {
        if(lobbies.length > 0){
            callback();
        }
        else{
            return res.status(409).json({errors: "Lobby does not exist."})
        }
    });
}


function lobbyNotExists(lobbyID, res, schema, callback){
    schema.lobby.find({ lobbyID: lobbyID }, (err, lobbies) => {
        if(lobbies.length === 0){
            callback();
        }
        else{
            return res.status(409).json({errors: "Lobby already exists"})
        }
    });
}

