//Require Statements
var expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();


//Uses sanitizer npm library
app.use(expressSanitizer());

app.set("view engine", "ejs");

//To serve static files such as images, CSS files, and JavaScript files, within 'public' directory  
app.use(express.static("public"));

//Enables use of method override with extension '_method'
app.use(methodOverride("_method"));

//Enables use of body parser, Extended = true more than any type of data
app.use(bodyParser.urlencoded({extended: true}));

//Mongoose Config
mongoose.connect("mongodb://localhost:27017/sneaker-blog", {
    //fixes deprecation warnings
    useNewUrlParser: true , 
    useUnifiedTopology: true,
    useFindAndModify: false
});

//Creates a schema for blog
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{
        type: Date,
        default: Date.now
    }
});

//Creates blog mongoose model
var Blog = mongoose.model("Blog", blogSchema);

//Home page redirects to blogs
app.get("/", (req, res)=>{
    res.redirect("/blogs");
});

//Index: Blogs Page Displays ALl Blogs
app.get("/blogs", (req, res) =>{
    
    //iterates through blogs
    Blog.find({}, (err, blogs)=>{
        if(err){
            //error
            console.log("[DataBase] Error Finding Blogs");
        }else{
            //renders blog page  
            res.render("index", {blogs: blogs});
        }
    });
});

//New: route to new blog
app.get("/blogs/new", (req,res)=>{
    res.render("new");
}); 

//Create: takes in post request to create new blog
app.post("/blogs", (req,res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    //creats new blog
    Blog.create(req.body.blog, (err, newBlog) =>{
        if (err){
            //Displays the form again on error
            res.render("new");
        }else{
            //Back to index
            res.redirect("/blogs");
        }
    });
});

//Show: route displaying the full blog
app.get("/blogs/:id", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            //redirects to index on error
            console.log("[DataBase] Blog: "+req.params.id +" Not Found");
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//Edit: Route to edit
app.get("/blogs/:id/edit", (req, res) =>{
    Blog.findById(req.params.id, (err, foundBlog) =>{
        if(err){
            //redirect back to index on error
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
}); 

//Update: Route for put request
app.put("/blogs/:id", (req,res)=>{
    //sanitizes: prevents script tags and etc
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.params.blog, (err, updatedBlog)=>{
        if(err){
            //redirects to index on error
            res.redirect("/blogs");
        }else{
            //redirects to specific blog page
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//Delete: Handles route for delete requests
app.delete("/blogs/:id", (req,res)=>{
    Blog.findByIdAndDelete(req.params.id, (err) =>{
        //Added for future
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, function(){
    console.log("[Server] Running...");
});