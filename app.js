// Secret keys
const secret = require('./secret');

/////////////
// Express //
/////////////

const express = require("express");
const app = express({});
const development_env = true;

const session = require('express-session');

const lobbySchema = require('./schema/lobby');

sessionSettings = {
    secret: secret.SessionKey,
    cookie: {secure: true},
    resave: false,
    saveUninitialized: false
};


//////////////
// Mongoose //
//////////////

const dbUrl = "mongodb://localhost:27017/c5e";
const mongoose = require('mongoose');


//////////
//Pusher//
//////////


const Pusher = require('pusher');
const Chatkit = require('@pusher/chatkit-server');

const chatkit = new Chatkit.default({
    instanceLocator: secret.chatkit_instance,
    key: secret.chatkit_key
});


const pusher = new Pusher({
    appId: secret.pusher_app_id,
    key: secret.pusher_key,
    secret: secret.pusher_secret,
    cluster: secret.pusher_cluster
});


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
    require('./routes/route')(app, lobbySchema, pusher, chatkit);


    // Default 404
    app.use(function (req, res, next) {
        res.status(404).send("Sorry can't find that!")
    });


    app.listen(8888, () => console.log("App listening on port 8888"));

});