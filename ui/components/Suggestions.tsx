import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { ExpandCircleDown } from '@mui/icons-material';
import Item from '../components/Item';
import '../../ui/css/style.css';
import { PrometheusDriver } from 'prometheus-query';
import { useState, useEffect } from 'react';

interface Container {
  value: {
    value: number;
  };
}

const Suggestions = ({ id }: any) => {
  const [MEMSuggestion, setMEMSuggestion] = useState<String>(
    'Please select a container to view optimization suggestions.',
  );
  const [CPUSuggestion, setCPUSuggestion] = useState<String>(
    'Please select a container to view optimization suggestions.',
  );
  const [status, setStatus] = useState<String>(
    'Please select a container to view your container at a glance.',
  );
  const prom: any = new PrometheusDriver({
    endpoint: 'http://localhost:39871',
  });

  useEffect(() => {
    currentStatus(id);
    getAvgMEMOverTime(id);
    getAvgCPUOverTime(id);
  }, [id]);

  const currentStatus = async (id: string) => {
    try {
      const memQuery = `memory_usage_percent{container_id="${id}",job="docker_stats"}`;
      const cpuQuery = `cpu_usage_percent{container_id="${id}",job="docker_stats"}`;
      const networkInQuery = `network_in_bytes{container_id="${id}",job="docker_stats"}`;
      const networkOutQuery = `network_out_bytes{container_id="${id}",job="docker_stats"}`;
      const pidsQuery = `pids{container_id="${id}",job="docker_stats"}`;
      const memRes = await prom.instantQuery(memQuery);
      const cpuRes = await prom.instantQuery(cpuQuery);
      const networkInRes = await prom.instantQuery(networkInQuery);
      const networkOutRes = await prom.instantQuery(networkOutQuery);
      const pidsRes = await prom.instantQuery(pidsQuery);
      const memValue = memRes.result[0].value.value.toFixed(2);
      const cpuValue = cpuRes.result[0].value.value.toFixed(2);
      const networkInVal = networkInRes.result[0].value.value;
      const networkOutVal = networkOutRes.result[0].value.value;
      const pidsVal = pidsRes.result[0].value.value;
      setStatus(
        `Memory Usage %: ${memValue}%  CPU Usage %: ${cpuValue}%  Network I/O: ${networkInVal}/${networkOutVal}  PIDS: ${pidsVal}`,
      );
    } catch (err) {
      console.log(err);
    }
  };
  const getAvgCPUOverTime = async (id: string) => {
    try {
      const query = `avg_over_time(cpu_usage_percent{container_id="${id}",job="docker_stats"}[7d])`;

      const res = await prom.instantQuery(query);
      console.log(res);
      const value = Number(res.result[0].value.value.toFixed(2));
      if (value >= 70) {
        setCPUSuggestion(`For the past 7 days, your CPU Usage Percent has been been greater than or equal to 70%, averaging at ${value}%. 
        To optimize your container's resources, Dockasaurus RX recommends to create a Docker Swarm. 
        Docker Swarm offers many features to optimize your container's resources and performance such as automatic scaling, desired state reconciliation, load balancing and many more. 
        For more information, please refer to the Docker documentation here: https://docs.docker.com/engine/swarm/swarm-tutorial/`);
      }
      if (value <= 30) {
        setCPUSuggestion(`For the past 7 days, your CPU Usage Percent has been less than or equal to 30%, averaging at ${value}%.
        To optimize your container's resources, Dockasaurus RX recommends to lower the CPU limit to about 40% of your current limit. 
        This will allow other containers that need more CPU to perform better.
        To lower the CPU limit for your container, you can run the command "docker run --cpus=(number of bytes here) (image or container ID here)".
        For more information, please refer to the Docker documentation here: https://docs.docker.com/config/containers/resource_constraints/`);
      }
      if (value > 30 && value <= 50) {
        setCPUSuggestion(
          `For the past 7 days, your CPU Usage Percent has been healthy, using between 30% to 50% of your CPU, averaging at ${value}%.`,
        );
      }
      if (value > 50 && value < 70) {
        setCPUSuggestion(
          `For the past 7 days, your CPU Usage Percent has been slightly higher than normal, using between 50% to 70% of your CPU, averaging at ${value}%. CPU Usage may need to be optimized soon.`,
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAvgMEMOverTime = async (id: string) => {
    try {
      const query = `avg_over_time(memory_usage_percent{container_id="${id}",job="docker_stats"}[7d])`;
      const res = await prom.instantQuery(query);

      const value = Number(res.result[0].value.value.toFixed(2));
      if (value >= 70) {
        setMEMSuggestion(`For the past 7 days, your Memory Usage Percent has been greater than or equal to 70%, averaging at ${value}%. 
        To optimize your container's resources, Dockasaurus RX recommends to create a Docker Swarm. 
        Docker Swarm offers many features to optimize your container's resources and performance such as automatic scaling, desired state reconciliation, load balancing and many more. 
        For more information, please refer to the Docker documentation here: https://docs.docker.com/engine/swarm/swarm-tutorial/`);
      }
      if (value <= 30) {
        setMEMSuggestion(`For the past 7 days, your Memory Usage Percent has been less than or equal to 30%, averaging at ${value}%.
        To optimize your container's resources, Dockasaurus RX recommends to lower the memory limit to about 40% of your current limit. 
        This will allow other containers that need more memory to perform better.
        To lower the memory limit for your container, you can run the command "docker run -m (number of bytes here)(b, k, m, g suffix here) (image or container ID here)".
        For more information, please refer to the Docker documentation here: https://docs.docker.com/config/containers/resource_constraints/`);
      }
      if (value > 30 && value <= 50) {
        setMEMSuggestion(
          `For the past 7 days, your Memory Usage Percent has been healthy, using between 30% to 50% of your memory, averaging at ${value}%.`,
        );
      }
      if (value > 50 && value < 70) {
        setMEMSuggestion(
          `For the past 7 days, your Memory Usage Percent has been slightly higher than normal, using between 50% to 70% of your memory, averaging at ${value}%. Memory Usage may need to be optimized soon.`,
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Item>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandCircleDown />}
          aria-controls='panel1a-content'
          id='panel1a-header'>
          <Typography
            sx={{
              fontSize: 16,
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
            color='text.primary'>
            Your Containers At A Glance
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body1' color='text.secondary'>
            {status}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandCircleDown />}
          aria-controls='panel2a-content'
          id='panel2a-header'>
          <Typography
            sx={{
              fontSize: 16,
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
            color='text.primary'>
            Memory Usage Optimization Recommendation
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body1' color='text.secondary'>
            {MEMSuggestion}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandCircleDown />}
          aria-controls='panel3a-content'
          id='panel3a-header'>
          <Typography
            sx={{
              fontSize: 16,
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
            color='text.primary'>
            CPU Usage Optimization Recommendation
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body1' color='text.secondary'>
            {CPUSuggestion}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Item>
  );
};

export default Suggestions;
