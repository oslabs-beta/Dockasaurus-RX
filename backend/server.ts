import axios from 'axios';
import express from 'express';
import fs from 'fs';

type AxiosInstance = typeof axios;

interface Container {
  Id: string;
  Image: string;
  Command: string;
  Created: number;
  Status: string;
  Ports: string[];
  Names: string[];
}

async function getDockerContainers(): Promise<Container[]> {
  const response = await axios.get<Container[]>('/containers/json', {
    socketPath: '/var/run/docker.sock',
    params: { all: true },
  });
  const containers = response.data;

  return containers;
}

const app = express();

try {
  fs.unlinkSync('/run/guest-services/backend.sock');
  console.log('Deleted the UNIX socket file.');
} catch (err) {
  console.log('Did not need to delete the UNIX socket file.');
}
app.get('/test', async (req: any, res: any) => {
  try {
    const data = await getDockerContainers();
    const images = [];
    for (let i = 0; i < data.length; i++) {
      images.push(data[i]['Names']);
    }
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen('/run/guest-services/backend.sock', () => {
  console.log(`🚀 Server listening on ${'/run/guest-services/backend.sock'}`);
});

// import Bun from '@bun/bun';

// const server: Response = Bun.serve({
//   unix: '/run/guest-services/backend.sock',
//   fetch(req) {
//     if (req.url === '/test') {
//       const message = req.body.message;
//       return new Response('test from backend!');
//     } else {
//       return new Response('Not found', { status: 404 });
//     }
//   },
// });
