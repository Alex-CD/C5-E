
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
                pusher.trigger(lobbyID+"-game", 'client-notify-game-add-player', {civName: civName, playerID: playerID, sessionID: sessionID});

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
            pusher.trigger(lobbyID+"-game", 'client-notify-game-remove-player', { sessionID: sessionID });

            res.status(201).json(lobbyID)
        });
};


module.exports.getRooms = function getRooms(lobbyID, sessionID, res, schema, chatkit){
    chatkit.getUserJoinableRooms({ userId: sessionID})
        .then((rooms) => {

            //Removing games from other lobbies from list
            lobbyID.length().then((err, length) => {
                for (let i = 0; i < rooms.length; i++) {
                    if (rooms[i].name.substring(0, length - 1) !== lobbyID) {
                        rooms.splice(i, 1);
                    }
                }
                res.status(200).json(rooms);
            }).catch((err) => {
                console.log(err);
            });
        })
};


module.exports.deleteGame = function deleteGame(lobbyID, res, schema, playerID, chatkit){
    schema.lobby.findOne({ lobbyID: lobbyID }, (err, lobby)=> {
        if (err) {
            console.log("Error finding lobby to delete: " + err);
            return;
        }


        // Generating list of users to delete
        let players = [];
        for (let i = 0; i < lobby.players.length; i++) {
            players.push({id: lobby.players[i].sessionID, name: lobby.players[i].playerID});
        }

        // Generating list of rooms to delete
        let rooms = [];

        for (let i = 0; i < lobby.players.length - 1; i++) {
            for (let x = i; x < players.length; x++) {
                let roomName = lobbyID + "-" + players[i].playerID + players[x].playerID + "-PM";
                rooms.push({name: roomName, userIds: [players[i].sessionID, players[x].sessionID]})
            }
        }

        // Deleting users
        for( let i = 0 ; i < players.length; i++) {
            chatkit.deleteUser({ id: players[i].sessionID}).then( (err)=>{
                if(err){
                    console.log("Error deleting user: " + err);
                }


                // Deleting lobby in database
                schema.lobby.findOneAndDelete({lobbyID: lobbyID}).then((err) => {
                    if (err) {
                        console.log("Error deleting lobby: " + err);
                        res.status(500).json();
                        return;
                    }

                    res.status(200).json();
                })


            });
        }

    });

};


//////////////////////
// Internal Methods //
//////////////////////


