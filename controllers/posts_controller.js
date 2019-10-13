const {
  getAllPosts,
  getPostById,
  addPost,
  deletePost,
  updatePost
} = require('../utils/utilities');

const getPosts = function(req, res) {
	// getAllPosts returns a promise, or an error
	getAllPosts(req)
		.then(posts => {
			res.send(posts)
		})
		.catch(err => {
			// Errors are passed back from mongodb
			res.status(500)
			res.json({
				error: err.message
			})
		})
}

const getPost = function(req, res) {
	// getPostById returns a promise
	getPostById(req)
		.then(post => {
			res.send(post)
		})
		.catch(err => {
			res.status(404)
			res.send("Post not found")
		})
}

const makePost = function (req, res) {
    if (req.error) {
        res.status(req.error.status);
        res.send(req.error.message);
    } else {
    // add the username from req.user
        req.body.username = req.user.username;
        // save the Post instance from addPost
        addPost(req).save((err, post) => {
            if (err) {
                res.status(500);
                res.json({
                    error: err.message
                });
            }
            res.status(201);
            res.send(post);
        });
    }
};

const removePost = function (req, res) {
  // Check for error from middleware
  if (req.error) {
      res.status(req.error.status);
      res.send(req.error.message);
  } else {
      // execute the query from deletePost
      deletePost(req.params.id).exec((err) => {
          if (err) {
              res.status(500);
              res.json({
                  error: err.message
              });
          }
          res.sendStatus(204);
      });
  }
};

const changePost = function (req, res) {
  // Check for error from middleware
  if (req.error) {
      res.status(req.error.status);
      res.send(req.error.message);
  } else {
      // execute the query from updatePost
      updatePost(req).exec((err, post) => {
          if (err) {
              res.status(500);
              res.json({
                  error: err.message
              });
          }
          res.status(200);
          res.send(post);
      });
  }
};
const userAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.sendStatus(403);
  }
}

const verifyOwner = function (req, res, next) {
  // If post owner isn't currently logged in user, send forbidden

  if (req.user.role === 'admin') {
      next();
  } else {
      getPostById(req).exec((err, post) => {
          if (err) {
              req.error = {
                  message: 'Post not found',
                  status: 404
              }
              next();
          }
          if (req.user.username !== post.username) {
              req.error = {
                  message: 'You do not have permission to modify this post',
                  status: 403
              };
          }
          next();
      });
  }
}

const validUser = function (req, res, next) {
    // If user is blocked, send back an error
    if (req.user.blocked) {
        console.log("blocked user")
        req.error = {
            message: 'User is blocked',
            status: 403
        };
    }
    next();
}

const isAdmin = function (req, res, next) {
    if (req.user.role === 'admin') return next();
    else res.sendStatus(403);
}


module.exports = {
  getPosts,
  getPost,
  makePost,
  removePost,
  changePost,
  userAuthenticated,
  verifyOwner,
  validUser, 
  isAdmin
};