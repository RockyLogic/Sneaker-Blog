//Require Statements
var methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();


app.set("view engine", "ejs");

//To serve static files such as images, CSS files, and JavaScript files, within 'public' directory  
app.use(express.static("public"));

//Enables use of method override with extension '_method'
app.use(methodOverride("_method"));

//Enables use of body parser, Extended = true more than any type of data
app.use(bodyParser.urlencoded({extended: true}));