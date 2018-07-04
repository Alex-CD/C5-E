const express = require("express");
const app = express({});
const development_env = true;

const dbUrl = "mongodb://localhost:27017/c5e";
const mongoose = require('mongoose');

const session = require('express-session');
const secret = require('./secret');


const lobbySchema = require('./schema/lobby');

sessionSettings = {
    secret: secret.SessionKey,
    cookie: {secure: true},
    resave: false,
    saveUninitialized: false
};

mongoose.connect(dbUrl, { useNewUrlParser: true} ).then();

const db = mongoose.connection;

db.once('open', function() {

    if(development_env){
        db.dropDatabase();
            console.log('DEV lobbies dropped');


        sessionSettings.cookie.secure = false;
    }

    app.use(session(sessionSettings));



    // Routing
    require('./routes/route')(app, lobbySchema);


    // Default 404
    app.use(function (req, res, next) {
        res.status(404).send("Sorry can't find that!")
    });


    app.listen(8888, () => console.log("App listening on port 8888"));

});