const { Router } = require("express");
const { randomBytes } = require('crypto');

const routes = Router();

const commentsByPostId = {};

routes.post('/posts/:id/comments', (req, res) => {
  const { id: postId } = req.params;

  const id = randomBytes(4).toString('hex');

  const { content } = req.body;

  const comment = {
    id,
    content,
  }

  const comments = commentsByPostId[postId] || []
  comments.push(comment);

  commentsByPostId[postId] = comments;
  
  return res.status(201).json(comment)
})

routes.get('/posts/:id/comments', (req, res) => {
  const { id: postId } = req.params;

  const comments = commentsByPostId[postId] || [];

  return res.json(comments);
})

module.exports = { routes }