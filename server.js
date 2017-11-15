'use strict'

//first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//and create our instances
var app = express();
var router = require('./routes/index.js');

//set our port to either a predetermined port number if you have set
//it up, or 3001
var port = process.env.API_PORT || 3001;


//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1:27017/mern_database';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;


//now we should configure the API to use bodyParser and look for
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

//and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//Use our router configuration when we call /api
app.use('/api', router);

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//starts the server and listens for requests
app.listen(port, function() {
    console.log(`api running on port ${port}`);
});

router.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
});



//adding the /comments route to our /api router
router.route('/comments')
//retrieve all comments from the database
    .get(function(req, res) {
        //looks at our Comment Schema
        Comment.find(function(err, comments) {
            if (err)
                res.send(err);
            else res.json(comments)
        });
    })
    //post new comment to the database
    .post(function(req, res) {
        let comment = new Comment();
        //body parser lets us use the req.body
        comment.author = req.body.author;
        comment.text = req.body.text;
        console.log("adding comment: " + comment.author + " " + comment.text);
        comment.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Comment successfully added!' });
        });
    });