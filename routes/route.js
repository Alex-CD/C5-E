module.exports = function(app, lobbySchema, pusher, chatkit){


    const express = require('express');
    const router = express.Router({});

    // Adding routes from other files
    require("./index")(router);
    require("./game")(router, lobbySchema, pusher, chatkit);
    require("./lobby")(router, lobbySchema, pusher);

    app.use(router);
};
