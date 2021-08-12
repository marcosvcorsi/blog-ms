const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.post('/events', async (req, res) => {
  console.log('event received');

  const event = req.body;
  const { type, data } = event;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {
       ...data,
        status,
      },
    }).then(() => console.log('CommentModerated sent'));
  }
})

const port = process.env.PORT || 4004;
app.listen(port, () => console.log(`Server is running at ${port}`));