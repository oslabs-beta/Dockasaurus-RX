import axios from 'axios';
import express from 'express';
import fs from 'fs';
import http from 'node:http';
import { cpuUsageGauge, memoryUsageGauge, networkInGauge, networkOutGauge, pidsGauge, registry } from './promClient';

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

const app = express();
app.use(express.json());
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
  const data = await new Promise<DockerStats[]>((resolve, reject) => {
    const req = http.request(options, res => {
      let stats: DockerStats[] = [];
      res.on('data', chunk => {
        stats.push(JSON.parse('' + chunk));
      });
      res.on('end', () => {
        resolve(stats);
      });
    });
    req.end();
  });
  const cpu_stats = data[0].cpu_stats;
  const precpu_stats = data[0].precpu_stats;
  const memory_stats = data[0].memory_stats;
  const networks = data[0].networks;
  const pids = data[0].pids_stats.current || 0;
  //calculate cpu usage %
  const cpu_delta =
    cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage;
  const system_cpu_delta =
    cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage;
  const number_cpus = cpu_stats.online_cpus;
  const cpu_usage_percent =
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
  const network_in_bytes = totalNetworks.reduce((sum, network) => sum + (network.rx_bytes || 0), 0);
  const network_out_bytes = totalNetworks.reduce((sum, network) => sum + (network.tx_bytes || 0), 0);
  networkInGauge.labels({ container_id: id}).set(network_in_bytes);
  networkOutGauge.labels({ container_id: id }).set(network_out_bytes)
  cpuUsageGauge.labels({ container_id: id }).set(cpu_usage_percent);
  memoryUsageGauge.labels({ container_id: id }).set(memory_usage_percent);
  pidsGauge.labels({container_id : id}).set(pids);
  const containers = data;
  return containers;
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
    'http://host.docker.internal:40001/api/admin/provisioning/dashboards/reload',
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
  const dashboard: any = JSON.parse(
    fs.readFileSync('/dashboards/container-metrics/dashboard.json').toString(),
  );
  dashboard.panels.forEach((element: any) => {
    element.fieldConfig.overrides[0].matcher.options = `/^((?!).)*$/`;
  });
  fs.writeFileSync(
    '/dashboards/container-metrics/dashboard.json',
    JSON.stringify(dashboard),
  );
  await fetch(
    'http://host.docker.internal:40001/api/admin/provisioning/dashboards/reload',
    {
      method: 'POST',
      headers: new Headers({
        Authorization: `Basic ${btoa('admin:admin')}`,
      }),
    },
  );
  res.status(200).send();
});
app.listen('/run/guest-services/backend.sock', () => {
  console.log(`🚀 Server listening on ${'/run/guest-services/backend.sock'}`);
});

app.get('/test2', async (req, res) => {
  const result = await axios.get('http://localhost:2424/metrics');
  const data = result.data;
  res.status(200).json(data);
});

const promConnection = express();

promConnection.get('/metrics', async (req, res) => {
  const containers = await getDockerContainers();
  const stats = await Promise.all(
    containers.map(e => getDockerContainerStats(e.Id)),
  );
  res.set('Content-Type', registry.contentType);
  const data = await registry.metrics();
  res.status(200).send(data);
});
promConnection.listen(2424);
