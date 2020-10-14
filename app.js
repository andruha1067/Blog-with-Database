const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Check out my latest posts!";
const aboutContent = "This is my blog/diary site where I ramble on about all mundane things that happen in my life.";
const contactContent = "Email: andruha1067@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", blogSchema);


app.get("/", function(req, res){

  Post.find({}, function(err, posts) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    } else {
      console.log(err);
    }
  });
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postID", function(req, res){

  Post.findOne({_id: req.params.postID}, function(err, foundPost) {
    //console.log(foundPost.title);
    if (!err && foundPost.length !== 0) {
      res.render("post", {
        title: foundPost.title,
        content: foundPost.content
      });
    } else {
      console.log(err);
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


// Local Host or Heroku Server Connection Setup
let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port: ", port);
});
