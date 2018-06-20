const express = require("express");
const app = express();

const dbUrl = "mongodb://localhost:27107/db";
const mongoClient = require("mongodb").MongoClient;


mongoClient.connect(dbUrl, function(err, db){
    if(err){
        console.log("FATAL: Unable to connect to mongodb.");
        process.exit(0);
    }

    mongoClient.close();
});

// Routing
app.use('/', require('./routes/index'));

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});


app.listen(8888, () => console.log("App listening on port 8888"));

