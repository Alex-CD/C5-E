module.exports = function(router) {
    const path = require('path');

    // Homepage
    router.get('/', function (req, res, next) {
        res.sendFile(path.resolve("./views/index.html"));
    });

    // About page
    router.get('/about', function (req, res, next) {
        res.sendFile(path.resolve("./views/about.html"));
    });
};