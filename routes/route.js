const express = require('express');
const router = express.Router({});


module.exports = function(db){


// Adding routes from other files
    require("./index")(router);
    require("./game")(router);
    require("./lobby")(router);
};