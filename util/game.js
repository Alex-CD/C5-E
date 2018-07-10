
//////////////////////
// Exported Methods //
//////////////////////

module.exports.getGame = function getGame(params, res, schema){

    schema.lobby.find({ lobbyID: params.lobbyID }, (err, lobbies) => {
        if(lobbies.length > 0){
            res.send(lobbies[0]);
        }
        else {
            return res.status(409).json({errors: "Game does not exist."})
        }
    });
};


module.exports.joinSlot = function joinSlot(lobbyID, playerID, civName, sessionID, res, schema, pusher){
    schema.player.create({playerID: playerID, sessionID: sessionID, civName: civName }, (err, toAdd )=>{
        if (err) {
            console.log(err);
            res.write(err);
        }


        schema.lobby.findOneAndUpdate({ lobbyID: lobbyID},
            {$push: { players: toAdd }},
            (err)=> {
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


module.exports.leaveSlot = function leaveSlot(lobbyID, sessionID, res, schema, pusher){
    schema.lobby.findOneAndUpdate(
        {
            lobbyID: lobbyID,
            players: {$elemMatch: { sessionID: sessionID}}
        },

        {$set: {"players.$.playerID": "", "players.$.sessionID": ""}},

        (err) => {
            if(err){
                console.log(err);
                res.status(404).json({ errors: err.mapped()});
            }

            // Notifying clients of lobby change
            pusher.trigger(lobbyID+"-lobby", 'state-update', {});

            res.status(201).json(lobbyID)
        });
};







//////////////////////
// Internal Methods //
//////////////////////


