const express = require("express");
const app = express();
const development_env = true;

const dbUrl = "mongodb://localhost:27017/c5e";
const mongoClient = require("mongodb").MongoClient;


// Init MongoDB connection
mongoClient.connect(dbUrl, function(err, client) {

    if (err) throw err;


    const db = client.db('c5e');

    if(development_env){db.dropDatabase();}


    // Routing
    require('./routes/route')(app, db);


    // Default 404
    app.use(function (req, res, next) {
        res.status(404).send("Sorry can't find that!")
    });


    app.listen(8888, () => console.log("App listening on port 8888"));

});