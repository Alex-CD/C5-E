module.exports = function(app, db){

    const express = require('express');
    const router = express.Router({});

    // Adding routes from other files
    require("./index")(router, db);
    require("./game")(router, db);
    require("./lobby")(router, db);

    app.use(router);

};
