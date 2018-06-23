const {check, validationResult} = require("express-validator/check");


module.exports = function(router, db, utils){
    const lobbies = db.collection("lobby");
    const lobbyUtils = require.main.require('./util/lobby');

    // Load lobby page
    router.get('/lobby', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Load lobby page here");
        res.end();
    });


    // Generating new lobby
    router.post('/lobby/:lobbyID',
        [check('lobbyID')
            .exists().withMessage("No Lobby name supplied.")
            .isAlphanumeric().withMessage("Lobby name must be alphanumeric.")
            .isLength({ max: 20}).withMessage("Lobby name must be <20 characters in length.")
            .custom(
                value => {
                    return lobbies.find({lobbyID: value}).count().then(
                        count => {
                            return (count === 0);
                        })
                }).withMessage("Room name already taken!")],
        function (req, res){

            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(422).json({ errors: errors.mapped() });
            }

            lobbies.insert({lobbyID: req.params['lobbyID']});

            return res.status(201).json( req.params );
        });


    // Adding civ to lobby
    router.post("/lobby/createCiv", [
            check('playerName')
                .exists().withMessage("No player name supplied")
                .isAlphanumeric().withMessage("Player name invalid")
                .isLength({max: 20}).withMessage("Player name must be shorter than 21 chars"),
            check('civName')
                .exists().withMessage("No civ name supplied")
                .isAlphanumeric().withMessage("Civ name invalid")
                .isLength({max: 20}).withMessage("Civ name too long"),
            check('clientID')
                .exists().withMessage("No clientID supplied")],

        function(req, res, next){


        });

    // Getting Lobby data
    router.get('/lobby/:lobbyID',
        [check('lobbyID')
            .exists().withMessage("No Lobby name supplied.")
            .isAlphanumeric().withMessage("Lobby name must be alphanumeric.")
            .isLength({ max: 20}).withMessage("Lobby name too long!")
            .custom( value => { return lobbies.find({lobbyID: value}).count().then(count =>{
                return (count > 0 );
            })}).withMessage("Lobby does not exist.")
        ],
        function (req, res, next) {
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return res.status(422).json({ errors: errors.mapped() });
            }

            lobbyUtils.getLobby(lobbies, req.params.lobbyID, res);
        });
};