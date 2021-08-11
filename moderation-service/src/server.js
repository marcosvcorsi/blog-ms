const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.post('/events', (req, res) => {
  const event = req.body;
  const { type, data } = event;

  if (type === 'CommentCreated') {

  }
})

const port = process.env.PORT || 4004;
app.listen(port, () => console.log(`Server is running at ${port}`));