const { Router } = require("express");
const { randomBytes } = require('crypto');
const axios = require("axios");

const routes = Router();

const commentsByPostId = {};

routes.post('/posts/:id/comments', async (req, res) => {
  const { id: postId } = req.params;

  const id = randomBytes(4).toString('hex');

  const { content } = req.body;

  const comment = {
    id,
    content,
    postId,
  }

  const comments = commentsByPostId[postId] || []
  comments.push(comment);

  commentsByPostId[postId] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: comment,
  }).then(() => console.log('CommentCreated sent'));
  
  return res.status(201).json(comment)
})

routes.get('/posts/:id/comments', (req, res) => {
  const { id: postId } = req.params;

  const comments = commentsByPostId[postId] || [];

  return res.json(comments);
})

routes.post('/events', (req, res) => {
  console.log('Event Received: ', req.body);
  
  return res.send();
})

module.exports = { routes }