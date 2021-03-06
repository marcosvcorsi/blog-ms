const { Router } = require("express");
const { randomBytes } = require('crypto');
const axios = require('axios');

const routes = Router();

const posts = [];

routes.post('/posts', async (req, res) => {
  console.log('POST /posts', req.body);

  const id = randomBytes(4).toString('hex');

  const { title } = req.body;

  const post = {
    id,
    title,
  }

  posts.push(post);

  await axios.post('http://event-bus-service:4005/events', {
    type: 'PostCreated',
    data: post,
  }).then(() => console.log('PostCreated sent'))
    .catch(error => console.error('Error to send event', error));
  
  return res.status(201).json(post)
})

routes.get('/posts', (req, res) => {
  console.log('GET /posts');

  return res.json(posts);
})

routes.post('/events', (req, res) => {  
  console.log('Event Received: ', req.body);

  return res.send();
})

module.exports = { routes }