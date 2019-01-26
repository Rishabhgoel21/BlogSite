var express          = require("express"),
    app              = express(),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose");
    
//APP config
mongoose.connect("mongodb://localhost:27017/blogApp", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));

//Mongoose Model/Schema config
var blogSchema = new mongoose.Schema({
   title : String,
   image : String,
   body : String,
   created : {
       type : Date , 
       default : Date.now
   }
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title : "What is Fuchsia OS?",
//   image : "https://beebom.com/wp-content/uploads/2019/01/fuchsia-OS.jpg",
//   body : "Fuchsia is a capability-based operating system currently being developed by Google. It first became known to the public when the project appeared on GitHub in August 2016 without any official announcement. In contrast to prior Google-developed operating systems such as Chrome OS and Android, which are based on Linux kernels, Fuchsia is based on a new microkernel called Zircon "
// });

//Restful Routes

//Index Route
app.get("/", function(req, res) {
    res.redirect("/blogs");    
});

app.get("/blogs", function(req, res){
   Blog.find({},function(err, foundBlog){
        if(err){
            console.log("ERROR");
        } else{
               res.render("index",{ blogs : foundBlog}); 
        }
   });
});

//New Route
app.get("/blogs/new", function(req, res) {
   res.render("new"); 
});

//Create Route
app.post("/blogs", function(req, res){
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           console.log("ERROR");
       }else{
           res.redirect("/blogs");
       }
   }) ;
});

//Show Route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else{
               res.render("show", {blog : foundBlog});
       }
    });

});

//Edit Route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else{
           res.render("edit", {blog : foundBlog});
       }
    });

});

//PUT Route
app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
       } else{
           res.redirect("/blogs/" + req.params.id);
       }
    });

});

//Delete Route
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else{
           res.redirect("/blogs");
       }
    });

});

app.listen(process.env.PORT, process.env.IP);