let dataFile = "../data/blog_posts.json";
let blogPosts = require(dataFile);
const fs = require('fs');
const path = require('path');

const Post = require('../models/post');

// Exported functions

// get all posts
const getAllPosts = function(req) {
	return Post.find()
}

// get post by id
const getPostById = function(req) {
	return Post.findById(req.params.id)
}

// add post
// returns a promise
const addPost = function (req) {
  let date = Date.now();
  // Set dates for this new post
  req.body.create_date = date;
  req.body.modified_date = date;
  return new Post(req.body);
};


// delete post
// returns a query
const deletePost = function (id) {
  return Post.findByIdAndRemove(id);
};

// update post
// returns a query
const updatePost = function (req) {
  req.body.modified_date = Date.now();
  // use new:true to return the updated post rather than the original post when the query is executed
  return Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true
  });
};

module.exports = {
  getAllPosts,
  getPostById,
  addPost,
  deletePost,
  updatePost
}