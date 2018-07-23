
module.exports = function(router, schema, chatkit, pusher) {
    const path = require('path');
    const {check, validationResult} = require("express-validator/check");
    const gameUtils = require.main.require('./util/game');

    // Load game page
    router.get('/game', function (req, res, next) {
        res.sendFile(path.resolve("./views/game.html"));
    });


    // Getting game data
    router.get('/game/:lobbyID',
        [
            check('lobbyID')
                .exists().withMessage("No Lobby name supplied.")
                .isAlphanumeric().withMessage("Lobby name must be alphanumeric.")
                .isLength({max: 20}).withMessage("Lobby name too long!")],
        function (req, res, next) {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.mapped()});
            }

            gameUtils.getGame(req.params, res, schema);

        });


    // Remove player (by removing sessionID, slot is rejoinable)
    router.post('/game/:lobbyID/leaveSlot', [
        check('lobbyID')
            .isAlphanumeric().withMessage("Lobby name must be alphanumeric.")
            .isLength({max: 20}).withMessage("Lobby name too long!")
    ], function (req, res){

        const errors = validationResult(req);


        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.mapped()});
        }

        gameUtils.leaveSlot(req.params.lobbyID, req.sessionID, res, schema, pusher);
    });



    // Join into slot while game is underway
    router.post("/game/:lobbyID/joinSlot", [
            check('civName')
                .exists().withMessage("No civ name supplied")
                .isAlphanumeric().withMessage("Civ name invalid")
                .isLength({max: 20}).withMessage("Civ name too long"),
            check('playerID')
                .exists().withMessage("No name supplied!")
                .isAlphanumeric().withMessage("No username supplied")
                .isLength({max: 20}).withMessage("Username too long."),
            check('lobbyID')
                .isAlphanumeric().withMessage("lobbyID not alphanumeric")
                .isLength({max: 20}).withMessage("lobbyID too long")],
        function (req, res, next) {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.mapped()});
            }


            gameUtils.joinSlot(req.params.lobbyID, req.query.playerID, req.query.civName, req.sessionID, res, schema, pusher);

        });



    // Fetch joinable rooms
    router.get("/game/:lobbyID/getRooms",[
            check('lobbyID')
                .isAlphanumeric().withMessage("lobbyID not alphanumeric")
                .isLength({max: 20}).withMessage("lobbyID too long")],
        function (req, res, next){

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.mapped()});
            }

            gameUtils.getRooms(req.params.lobbyID, req.sessionID, res, schema, chatkit)
        });

    // Delete lobby (currently with no permissions)!
    router.post("/game/:lobbyID/deleteGame",[
            check('lobbyID')
                .isAlphanumeric().withMessage("lobbyID not alphanumeric")
                .isLength({max: 20}).withMessage("lobbyID too long")],
        function(req, res, next){

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.mapped()});
            }

            gameUtils.deleteLobby(req.params.lobbyID, res, schema);
        });
};