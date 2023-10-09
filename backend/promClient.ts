const promClient = require('prom-client');
export const registry = new promClient.Registry();
export const cpuUsageGauge = new promClient.Gauge({
    name: 'cpu_usage_percent',
    help: 'CPU usage of a Docker container',
    labelNames: ['container_id'],
});
  
export const memoryUsageGauge = new promClient.Gauge({
    name: 'memory_usage_percent',
    help: 'memory_usage_percent',
    labelNames: ['container_id'],
});

// export const memoryLimitGauge = new promClient.Gauge({
//     name: 'memory_limit',
//     help: 'memory_limit',
//     labelNames: ['container_id'],
// });

export const networkInGauge = new promClient.Gauge({
    name: 'network_in_bytes',
    help: 'network_in_bytes',
    labelNames: ['container_id'],
});

export const networkOutGauge = new promClient.Gauge({
    name: 'network_out_bytes',
    help: 'network_out_bytes',
    labelNames: ['container_id'],
});

export const pidsGauge = new promClient.Gauge({
    name: 'pids',
    help: 'pids',
    labelNames: ['container_id'],
});

registry.registerMetric(cpuUsageGauge);
registry.registerMetric(memoryUsageGauge);
registry.registerMetric(networkInGauge);
registry.registerMetric(networkOutGauge);
registry.registerMetric(pidsGauge);
// registry.registerMetric(memoryLimitGauge);
