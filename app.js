var express = require('express');
var methodOverride = require('method-override');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
expressSanitizer = require('express-sanitizer');
//MONGOOSE CONFIG
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/restful_blog_app");
//APP CONFIG

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.get("/",function(req,res){
    res.redirect("/blogs");
})
//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
})
var Blog = mongoose.model("Blog",blogSchema);
//RESTFUL ROUTES
app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("error");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});
app.get('/blogs/new',function(req,res){
    res.render("new");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
    req.body.blogs.body = req.sanitize(req.body.blogs.body);
    Blog.create(req.body.blogs,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
})
//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    })
})
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    req.body.blogs.body = req.sanitize(req.body.blogs.body);
    Blog.findById(req.params.id,function(err,editBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:editBlog});
        }
    })
})
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blogs.body = req.sanitize(req.body.blogs.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,upDatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})
//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findOneAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})
app.listen(3000,function(){
    console.log('Server is running!!!')
})