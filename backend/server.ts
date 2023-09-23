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

async function main() {
  const containers = await getDockerContainers();
  console.log(containers);
}
const app = express();

// After a server is done with the unix domain socket, it is not automatically destroyed.
// You must instead unlink the socket in order to reuse that address/path.
// To do this, we delete the file with fs.unlinkSync()
try {
  fs.unlinkSync('/var/run/docker.sock');
  console.log('Deleted the UNIX socket file.');
} catch (err) {
  console.log('Did not need to delete the UNIX socket file.');
}
console.log('hello');
app.get('/test', async (req: any, res: any) => {
  console.log('hello2');
  try {
    // Use the Docker SDK to obtain the data that you need
    const data = await getDockerContainers();

    // Return the data to the user in a JSON format
    res.json(data);
  } catch (err) {
    // Handle the error
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the extension server and the metrics server
app.listen('/var/run/docker.sock', () => {
  console.log(`🚀 Server listening on ${'/var/run/docker.sock'}`);
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
