import axios from 'axios';
import express from 'express';
import fs from 'fs';
import http from 'node:http';
import {
  cpuUsageGauge,
  memoryUsageGauge,
  networkInGauge,
  networkOutGauge,
  pidsGauge,
  registry,
} from './promClient';

type AxiosInstance = typeof axios;

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

interface Container {
  Id: string;
  Image: string;
  Command: string;
  Created: number;
  Status: string;
  Ports: string[];
  Names: string[];
}
const openStreams = new Set();
const app = express();
app.use(express.json());
try {
  fs.unlinkSync('/run/guest-services/backend.sock');
  console.log('Deleted the UNIX socket file.');
} catch (err) {
  console.log('Did not need to delete the UNIX socket file.');
}

app.get('/getContainers', async (req: any, res: any) => {
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
      let rawData = '';
      res.on('data', chunk => {
        rawData += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(rawData));
      });
    });
    req.end();
  });
  const containers = data;
  return containers;
}

function openStatsStream(id: String) {
  const options = {
    socketPath: '/var/run/docker.sock',
    method: 'GET',
    path: `/containers/${id}/stats`,
  };
  const req = http.request(options, res => {
    res.on('data', chunk => {
      let stats: DockerStats = JSON.parse('' + chunk);
      const cpu_stats = stats.cpu_stats;
      const precpu_stats = stats.precpu_stats;
      const memory_stats = stats.memory_stats;
      const networks = stats.networks;
      const pids = stats.pids_stats.current || 0;
      //calculate cpu usage %
      const cpu_delta =
        cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage;
      const system_cpu_delta =
        cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage;
      const number_cpus = cpu_stats.online_cpus;
      let cpu_usage_percent =
        (cpu_delta / system_cpu_delta) * number_cpus * 100.0;

      //calculate memory usage %
      const used_memory = memory_stats.usage - (memory_stats.stats?.cache || 0);
      const available_memory = memory_stats.limit;
      const memory_usage_percent = (used_memory / available_memory) * 100.0;

      //networks
      const totalNetworks = Object.values(networks || {}) as {
        rx_bytes?: number;
        tx_bytes?: number;
      }[];
      const network_in_bytes = totalNetworks.reduce(
        (sum, network) => sum + (network.rx_bytes || 0),
        0,
      );
      const network_out_bytes = totalNetworks.reduce(
        (sum, network) => sum + (network.tx_bytes || 0),
        0,
      );
      if (memory_usage_percent >= 0 && cpu_usage_percent >= 0) {
        networkInGauge.labels({ container_id: id }).set(network_in_bytes);
        networkOutGauge.labels({ container_id: id }).set(network_out_bytes);
        cpuUsageGauge.labels({ container_id: id }).set(cpu_usage_percent);
        memoryUsageGauge.labels({ container_id: id }).set(memory_usage_percent);
        pidsGauge.labels({ container_id: id }).set(pids);
      }
    });
    res.on('end', () => {
      console.log('stats stream ended:', id);
      openStreams.delete(id);
    });
  });
  req.end();
  openStreams.add(id);
}

app.post('/api/filtergraph/:id', async (req: any, res: any) => {
  console.log('hello');
  const { id } = req.params;
  console.log(id);
  const dashboard: any = JSON.parse(
    fs.readFileSync('/dashboards/container-metrics/dashboard.json').toString(),
  );
  dashboard.panels.forEach((element: any) => {
    element.fieldConfig.overrides[0].matcher.options = `/^((?!${id}).)*$/`;
  });
  fs.writeFileSync(
    '/dashboards/container-metrics/dashboard.json',
    JSON.stringify(dashboard),
  );
  await fetch(
    'http://host.docker.internal:39872/api/admin/provisioning/dashboards/reload',
    {
      method: 'POST',
      headers: new Headers({
        Authorization: `Basic ${btoa('admin:admin')}`,
      }),
    },
  );
  res.status(200).send();
});

app.delete('/api/filtergraph/', async (req: any, res: any) => {
  console.log('about to readfile');
  const dashboard: any = JSON.parse(
    fs.readFileSync('/dashboards/container-metrics/dashboard.json').toString(),
  );
  dashboard.panels.forEach((element: any) => {
    element.fieldConfig.overrides[0].matcher.options = `/^((?!).)*$/`;
  });
  console.log('about to write file');
  fs.writeFileSync(
    '/dashboards/container-metrics/dashboard.json',
    JSON.stringify(dashboard),
  );
  await fetch(
    'http://host.docker.internal:39872/api/admin/provisioning/dashboards/reload',
    {
      method: 'POST',
      headers: new Headers({
        Authorization: `Basic ${btoa('admin:admin')}`,
      }),
    },
  );
  console.log('backend successful');
  res.status(200).send();
});

app.post('/api/:id/start', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const status = await postDockerStart(id);
    res.status(204).send(status);
  } catch (error: any) {
    res.status(400).send('Internal Server Error');
  }
});

async function postDockerStart(id: String): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const options = {
      socketPath: '/var/run/docker.sock',
      method: 'POST',
      path: `/containers/${id}/start`,
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 204) {
          resolve('Container started successfully');
        } else {
          reject(
            `Failed to start container. Status code: ${res.statusCode}, Response: ${data}`,
          );
        }
      });
    });
    req.on('error', error => {
      reject(`Request error: ${error.message}`);
    });
    req.end();
  });
}

app.post('/api/:id/stop', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const status = await postDockerStop(id);
    res.status(204).send(status);
  } catch (error: any) {
    res.status(400).send('Internal Server Error');
  }
});

async function postDockerStop(id: String): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const options = {
      socketPath: '/var/run/docker.sock',
      method: 'POST',
      path: `/containers/${id}/stop`,
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 204) {
          resolve('Container stopped successfully');
        } else {
          reject(
            `Failed to stop container. Status code: ${res.statusCode}, Response: ${data}`,
          );
        }
      });
    });
    req.on('error', error => {
      reject(`Request error: ${error.message}`);
    });
    req.end();
  });
}

app.listen('/run/guest-services/backend.sock', () => {
  console.log(`🚀 Server listening on ${'/run/guest-services/backend.sock'}`);
});

const promConnection = express();

promConnection.get('/metrics', async (req, res) => {
  const containers = await getDockerContainers();

  containers.forEach(c => {
    if (!openStreams.has(c.Id)) {
      openStatsStream(c.Id);
    }
  });
  console.log(openStreams.entries());
  res.set('Content-Type', registry.contentType);
  const data = await registry.metrics();
  registry.resetMetrics();
  res.status(200).send(data);
});

promConnection.listen(39870);
