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
    service: 'comments-service',
    port: 4001,
  },
  {
    service: 'query-service',
    port: 4002,
  },
  {
    service: 'moderation-service',
    port: 4004,
  }
]

const dispatchEvent = async (event) => {
  try {
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

    console.log('Event dispatch successfully');
  } catch(error) {
    console.error('Error dispatching event', error);
  }
}

app.post('/events', async (req, res) => {
  const event = req.body;

  events.push(event);

  res.send();

  dispatchEvent(event);
});

const port = process.env.PORT || 4005;
app.listen(4005, () => console.log(`Server is running at ${port}`));