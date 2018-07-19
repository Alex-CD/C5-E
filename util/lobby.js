
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
                pusher.trigger(lobbyID+"-lobby", 'client-notify-lobby-add-player', {sessionID: sessionID, playerID: playerID, civName: civName});

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
                pusher.trigger(lobbyID+"-lobby", 'client-notify-lobby-remove-player', {sessionID: sessionID});

                res.status(201).json(lobbyID)
            });})
};


module.exports.startGame = function startGame(lobbyID, sessionID, res, schema, pusher, chatkit){
    schema.lobby.findOneAndUpdate({ lobbyID: lobbyID}, { inProgress: true },
        (err) => {
            if (err) {
                console.log(err);
                res.status(404).json({errors: err.mapped()});
            }

            // Initialising Chatkit users and rooms
            initChatKit(lobbyID, schema, chatkit);

            // Notifying clients
            pusher.trigger(lobbyID+"-lobby", 'client-notify-lobby-game-start', {});


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


function initChatKit(lobbyID, schema, chatkit){
    schema.lobby.findOne({ lobbyID: lobbyID }, (err, lobby)=>{


        // Creating array of users
        let players = [];
        for(let i = 0; i < lobby.players.length; i++){
            players.push({playerID: lobby.players[i].playerID, civID: lobby.players[i].civID});
        }

        // Creating array for PM rooms
        let rooms = [];

        for( let i = 0; i < lobby.players.length - 1; i++){
            for( let x = i; x < players.length; x++){
                let roomName = players[i].playerID + players[x].playerID + "PM";
                rooms.push({ name: roomName, userIds: [players[i].playerID, players[x].playerID] } )
            }
        }

        // Creating users
        chatkit.createUsers({ users: players })
            .then((res) => {
                console.log(res);
            }).catch((err) => {
            console.log(err);
        });



        //Creating 'global' channel
        chatkit.createRoom({
            creatorId: 'server',
            name: lobby.lobbyID + '-global',

        })
            .then(() => {
                console.log(lobby.lobby + "-global: Room created");
            }).catch((err) => {
            console.log(err);
        });


        //Creating 'PM' channels between users
        for(let i = 0; i < rooms.length; i++){
            chatkit.createRoom({
                name: rooms[i].name,
                creatorId: rooms[i].userIds[0],
                isPrivate: true,
                userIds: rooms[i].userIds
            }).then( () => {
                console.log("Created PM room")
            }).catch( (err) => {
                console.log(err);
            })
        }
    })




}
