const { default: axios } = require('axios');
const express = require('express');

const app = express();

app.use(express.json())

const events = [];

app.get('/events', (req, res) => {
  return res.send(events);
})

const services = [
  {
    service: 'posts-clusterip-service',
    port: 4000,
  },
  {
    service: 'localhost',
    port: 4001,
  },
  {
    service: 'localhost',
    port: 4002,
  },
  {
    service: 'localhost',
    port: 4003,
  },
  {
    service: 'localhost',
    port: 4004,
  }
]

app.post('/events', async (req, res) => {
  const event = req.body;

  events.push(event);

  const results = await Promise.allSettled(services.map(({ service, port }) => axios.post(`http://${service}:${port}/events`, event)));

  results.forEach((result, index) => {
    const { status } = result;

    const { service, port } = services[index];

    if(status === 'fulfilled') {
      console.log(`Event publish at ${service}:${port}`)
    } else {
      console.log(`Event error at ${service}:${port}`)
    }
  });

  return res.send();
});

const port = process.env.PORT || 4005;
app.listen(4005, () => console.log(`Server is running at ${port}`));