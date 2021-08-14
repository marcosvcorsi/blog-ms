const { Router } = require("express");
const axios = require('axios');

const routes = Router();

const posts = [];

routes.get('/posts', (req, res) => {
  return res.send(posts);
})

const handleEvents = (event) => {
  if (event.type === 'PostCreated') {
    const post = posts.find(post => post.id === event.data.id);

    if (!post) {
      posts.push({
        ...event.data,
        comments: [],
      })
    }
  ;
  }

  if(event.type === 'CommentCreated') {
    const post = posts.find(post => post.id === event.data.postId);

    if (post) {
      post.comments.push(event.data);
    }
  }

  if(event.type === 'CommentUpdated') {
    const post = posts.find(post => post.id === event.data.postId);

    if (post) {
      const commentIndex = post.comments.findIndex(comment => comment.id === event.data.id);

      if (commentIndex !== -1) {
        post.comments[commentIndex] = event.data;
      }
    }
  }
}

routes.post('/events', (req, res) => {
  const event = req.body;

  console.log('event received', event);

  handleEvents(event);

  return res.send();
})

const syncEvents = async () => {
  console.log('sync events');

  const { data } = await axios.get('http://event-bus-service:4005/events');

  console.log('data received', data);

  for(const event of data) {
    console.log('handle event', event);

    handleEvents(event);
  }
}

syncEvents();

module.exports = { routes }