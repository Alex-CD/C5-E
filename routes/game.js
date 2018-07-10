
module.exports = function(router, db, chatkit, pusher) {

    // Load game page (redirect to lobby)
    router.get('/game', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Load game page");
        res.end();
    });


    // get game data
    router.get('/game/:gameId', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Join existing lobby");
        res.end();
    });



};