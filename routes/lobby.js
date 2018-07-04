module.exports = function(router, schema) {

    const mongoose = require('mongoose');

    const {check, validationResult} = require("express-validator/check");
    const lobbyUtils = require.main.require('./util/lobby');


    // Load lobby page
    router.get('/lobby', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Load lobby page here");
        res.end();
    });


    // Creating new lobby
    router.post('/lobby/:lobbyID',
        [check('lobbyID')
            .exists().withMessage("No Lobby name supplied.")
            .isAlphanumeric().withMessage("Lobby name must be alphanumeric.")
            .isLength({max: 20}).withMessage("Lobby name must be <20 characters in length.")],
        function (req, res) {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.mapped()});
            }

            lobbyUtils.createLobby(req.params, schema, res)

        });


    // Joining lobby
    router.post("/lobby/:lobbyID/joinLobby", [
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


            console.log(req.params.lobbyID + req.query.playerID + req.query.civName + req.sessionID + "");
            lobbyUtils.addPlayer(req.params.lobbyID, req.query.playerID, req.query.civName, req.sessionID, res, schema);

        });


    // Getting Lobby data
    router.get('/lobby/:lobbyID',
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

                lobbyUtils.getLobby(req.params, res, schema);

            })
};
