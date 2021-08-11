const { default: axios } = require('axios');
const express = require('express');

const app = express();

app.use(express.json())

app.post('/events', async (req, res) => {
  const event = req.body;

  const servicesPorts =  [4000, 4001, 4002]

  const results = await Promise.allSettled(servicesPorts.map(port => axios.post(`http://localhost:${port}/events`, event)));

  results.forEach(result => console.log(result));

  return res.send();
});

const port = process.env.PORT || 4005;
app.listen(4005, () => console.log(`Server is running at ${port}`));