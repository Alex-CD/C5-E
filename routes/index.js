const express = require('express');
const router = express.Router({});

// Homepage
router.get('/', function(req, res, next){
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("Homepage");
    res.end();
});

// About page
router.get('/about', function(req, res, next){
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("About");
    res.end();
});



// Adding routes from other files
require("./game")(router);
require("./lobby")(router);



module.exports = router;