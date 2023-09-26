import axios from 'axios';
import express from 'express';
import fs from 'fs';
import http from 'node:http';
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

interface DockerStats {
  read: string;
  pids_stats: Record<string, number>;
  networks: Record<string, NetworkStats>;
  memory_stats: MemoryStats;
  blkio_stats: Record<string, unknown>;
  cpu_stats: CPUStats;
  precpu_stats: CPUStats;
}

interface NetworkStats {
  rx_bytes: number;
  rx_dropped: number;
  rx_errors: number;
  rx_packets: number;
  tx_bytes: number;
  tx_dropped: number;
  tx_errors: number;
  tx_packets: number;
}

interface MemoryStats {
  stats: Record<string, number>;
  max_usage: number;
  usage: number;
  failcnt: number;
  limit: number;
}

interface CPUStats {
  cpu_usage: {
    percpu_usage: number[];
    usage_in_usermode: number;
    total_usage: number;
    usage_in_kernelmode: number;
  };
  system_cpu_usage: number;
  online_cpus: number;
  throttling_data: {
    periods: number;
    throttled_periods: number;
    throttled_time: number;
  };
}

async function getDockerContainers(): Promise<Container[]> {
  const options = {
    socketPath: '/var/run/docker.sock',
    method: 'GET',
    path: '/containers/json',
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
        console.log('rawData: ', '' + chunk);
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
getDockerContainers().then(data => {
  getDockerContainerStats(data[0].Id).then(data2 => {
    console.log('data:', data2);
  });
});
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
    console.log('data from getDockerContainers', data);
    for (let i = 0; i < data.length; i++) {
      images.push(data[i]['Names']);
    }
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// async function getContainerStats(containerId: string): Promise<DockerStats> {
//   try {
//     const response = await axios.get<any>(`/containers/${containerId}/stats`, {
//       socketPath: '/var/run/docker.sock',
//       params: { all: true },
//     });
//     console.log(response.data);
//     return response.data;
//   } catch (err) {
//     console.log(err);
//   }
// };
async function getDockerContainerStats(containerId: string): Promise<any> {
  const response = await axios.get<Response>(`/containers/${containerId}/stats`, {
    socketPath: '/var/run/docker.sock',
    params: { all: true },
    // responseType: 'stream',
  });
  const containerStats = response.data;
  // containerStats.on('data', (data: Buffer) => {
  //   const stats = JSON.parse(data.toString());
  //   console.log(stats);
  // })
  console.log('containerStats in getDockerContainerStats:', containerStats);
  return containerStats;
}

// app.get('/stats:containerId', async (req: any, res: any) => {
//   const containerId = req.params.containerId;
//   const containerStats = await getContainerStats(containerId);
//   res.json(containerStats);
// })
app.get('/stats/:containerId', async (req: any, res: any) => {
  try {
    console.log('hello');
    const containerId = req.params.containerId;
    console.log(containerId);
    const containerStats = await getDockerContainerStats(containerId);

    if (containerStats === undefined) {
      res.status(404).send('Container not found');
    } else {
      console.log('containerStats in app.get', containerStats);
      res.json(containerStats);
    }
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
