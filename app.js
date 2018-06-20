const
    http = require("http"),
    path = require("path"),
    express = require("express"),
    app = express();



// Routing
app.use('/', require('./routes/index'));

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});


app.listen(8888, () => console.log("App listening on port 8888"));

