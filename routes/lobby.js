
module.exports = function(router, db) {

    // Load lobby page
    router.get('/lobby', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Load lobby page");
        res.end();
    });

    // Generating new lobby
    router.post('/lobby', function (req, res, next) {

    });


    // Getting existing lobby
    router.get('/lobby/:gameId', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Join existing lobby");
        res.end();
    });
};