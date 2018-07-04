module.exports = function(app, lobbySchema){


    const express = require('express');
    const router = express.Router({});

    // Adding routes from other files
    require("./index")(router);
    require("./game")(router);
    require("./lobby")(router, lobbySchema);


    app.use(router);
};
