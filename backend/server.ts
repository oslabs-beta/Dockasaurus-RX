import axios from 'axios';
import express from 'express';
import fs from 'fs';
import http from 'node:http';
import prometheusClient from 'prom-client';
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
      images.push({
        Name: data[i]['Names'],
        Id: data[i]['Id'],
        Image: data[i]['Image'],
        Created: data[i]['Created'],
        Ports: data[i]['Ports'],
        Status: data[i]['Status'],
      });
    }
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

async function getDockerContainers(): Promise<Container[]> {
  const options = {
    socketPath: '/var/run/docker.sock',
    method: 'GET',
    path: '/containers/json?all=1',
  };
  const data = await new Promise<Container[]>((resolve, reject) => {
    const req = http.request(options, res => {
      //console.log(res);
      let rawData = '';
      res.on('data', chunk => {
        rawData += chunk;
        //console.log('rawData: ', rawData);
      });
      res.on('end', () => {
        resolve(JSON.parse(rawData));
      });
    });
    req.end();
  });
  //console.log('Data: ', data);
  // const response = await axios.get<Container[]>('/containers/json', {
  //   socketPath: '/var/run/docker.sock',
  //   params: { all: true },
  // });
  const containers = data;

  return containers;
}

app.get('/api/stats/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const data = await getDockerContainerStats(id);
    res.json(data);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

async function getDockerContainerStats(id: String): Promise<Object> {
  const options = {
    socketPath: '/var/run/docker.sock',
    method: 'GET',
    path: `/containers/${id}/stats?stream=false`,
  };
  const data = await new Promise<Object[]>((resolve, reject) => {
    const req = http.request(options, res => {
      //console.log(res);
      let stats: object[] = [];
      res.on('data', chunk => {
        stats.push(JSON.parse('' + chunk));
      });
      res.on('end', () => {
        resolve(stats);
      });
    });
    req.end();
  });
  //console.log('Data: ', data);
  // const response = await axios.get<Container[]>('/containers/json', {
  //   socketPath: '/var/run/docker.sock',
  //   params: { all: true },
  // });
  const containers = data;

  return containers;
}
app.get('/test2', async (req, res) => {
  const result = await axios.get('http://localhost:42069/metrics');
  const data = result.data;
  res.status(200).json(data);
});
app.listen('/run/guest-services/backend.sock', () => {
  console.log(`🚀 Server listening on ${'/run/guest-services/backend.sock'}`);
});
const promConnection = express();
promConnection.get('/metrics', async (req, res) => {
  const containers = await getDockerContainers();
  const stats = await Promise.all(
    containers.map(e => getDockerContainerStats(e.Id)),
  );
  console.log('all stats', stats);
  res.status(200).json(stats);
});
promConnection.listen(42069);

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
