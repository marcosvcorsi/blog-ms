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
    status: 'pending',
  }

  const comments = commentsByPostId[postId] || []
  comments.push(comment);

  commentsByPostId[postId] = comments;

  await axios.post('http://event-bus-service:4005/events', {
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

routes.post('/events', async (req, res) => {
  const event = req.body;

  console.log('Event Received: ', event);

  if(event.type === 'CommentModerated') {
    const comments = commentsByPostId[event.data.postId];

    const commentIndex = comments.findIndex(comment => comment.id === event.data.id);

    if (commentIndex !== -1) {
      comments[commentIndex] = event.data;

      await axios.post('http://event-bus-service:4005/events', {
        type: 'CommentUpdated',
        data: comments[commentIndex],
      }).then(() => console.log('CommentUpdated sent'));
    }
  }
  
  
  return res.send();
})

module.exports = { routes }