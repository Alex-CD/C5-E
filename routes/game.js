
module.exports = function(router) {

    // Load game page
    router.get('/game', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Load game page");
        res.end();
    });


    // Join existing lobby
    router.get('/game/:gameId', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Join existing lobby");
        res.end();
    });

};