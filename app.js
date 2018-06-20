const express = require("express");
const app = express();

const dbUrl = "mongodb://localhost:27017";
const mongoClient = require("mongodb").MongoClient;

// Init MongoDB connection
mongoClient.connect(dbUrl, function(err, db) {
    if (err) throw err;


        // Routing
        require('./routes/route')(app, db);

        // Default 404
        app.use(function (req, res, next) {
            res.status(404).send("Sorry can't find that!")
        });


        app.listen(8888, () => console.log("App listening on port 8888"));

});
