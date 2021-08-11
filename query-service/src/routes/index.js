const { Router } = require("express");

const routes = Router();

const posts = [];

routes.get('/posts', (req, res) => {
  return res.send(posts);
})

routes.post('/events', (req, res) => {
  const event = req.body;

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

  return res.send();
})

module.exports = { routes }