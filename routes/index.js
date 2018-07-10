module.exports = function(router) {

    // Homepage
    router.get('/', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Homepage");
        res.end();
    });

    // About page
    router.get('/about', function (req, res, next) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("About");
        res.end();
    });




};