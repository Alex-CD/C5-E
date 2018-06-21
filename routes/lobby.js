const {check, validationResult} = require("express-validator/check");


module.exports = function(router, db){
    const games = db.collection("games");


    // Load lobby page
    router.get('/lobby', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Load lobby page");
        res.end();
    });

    // Generating new lobby
    router.post('/lobby/:gameId', [check('gameId')
            .exists().withMessage("No Lobby name supplied.")
            .isAlphanumeric().withMessage("Lobby name must be alphanumeric.")
            .isLength({ max: 20}).withMessage("Lobby name must be <20 characters in length.")
            .custom( value => { return games.find({gameId: value}).count().then(count =>{
                return (count === 0);
            })
            }).withMessage("Room name already taken!")],
            function (req, res){

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.mapped() });
        }

        games.insert({gameId: req.params['gameId']});

        return res.status(201).json( req.params );
    });

    // Adding civ to lobby
    router.post("/lobby/createCiv", function(req, res, next){

    });

    // Claiming Civ


    // Getting existing lobby
    router.get('/lobby/:gameId', function (req, res, next) {

    });
};