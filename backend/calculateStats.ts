import http from 'node:http';
import { cpuUsageGauge, memoryUsageGauge, pidsGauge, registry } from './promClient';

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



export default async function getDockerContainerStats(id: String): Promise<Object> {
    const options = {
      socketPath: '/var/run/docker.sock',
      method: 'GET',
      path: `/containers/${id}/stats?stream=false`,
    };
    const data = await new Promise<DockerStats[]>((resolve, reject) => {
      const req = http.request(options, res => {
        //console.log(res);
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
    console.log(data);
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
  
    cpuUsageGauge.labels({ container_id: id }).set(cpu_usage_percent);
    memoryUsageGauge.labels({ container_id: id }).set(memory_usage_percent);
    // memoryLimitGauge.labels({ container_id: id }).set(available_memory);
    pidsGauge.labels({container_id : id}).set(pids);
    const containers = data;
    return { memory_usage_percent, available_memory,};
  }