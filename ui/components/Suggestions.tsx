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


const Suggestions = ({id}: any) => {
  const [MEMSuggestion, setMEMSuggestion] = useState<String>('Please select a container to view optimization suggestions.')
  const [status, setStatus] = useState<String>('')
  const prom: any = new PrometheusDriver({
    endpoint: "http://localhost:9090"
  });
  
  useEffect(() => {
    currentStatus();
  },[]);
  useEffect(() => {
    getAvgMEMOverTime(id);
  },[id])

  const currentStatus = async () => {
    try {
        const memQuery = `avg_over_time(memory_usage_percent{job="docker_stats"}[7d])`;
        const cpuQuery = `avg_over_time(cpu_usage_percent{job="docker_stats"}[7d])`;
        const memRes = await prom.instantQuery(memQuery);
        const cpuRes = await prom.instantQuery(cpuQuery);

        const memValues: {
          under30: number[];
          healthy: number[];
          over70: number[];
        } = {
          under30: [],
          healthy: [],
          over70: [],
        };
        memRes.result.forEach((container: Container) => {
            if (container.value.value <= 30) {
                memValues.under30.push(container.value.value);
            }
            if (container.value.value > 30 && container.value.value < 70) {
                memValues.healthy.push(container.value.value);
            }
            if (container.value.value >= 70) {
                memValues.over70.push(container.value.value);
            }
        });
        const memPercentages = {
          under30Percent : memValues.under30.length / memRes.result.length * 100,
          healthyPercent : memValues.healthy.length / memRes.result.length * 100,
          over70Percent : memValues.over70.length / memRes.result.length * 100
        };

        const cpuValues: {
          under30: number[];
          healthy: number[];
          over70: number[];
        } = {
          under30: [],
          healthy: [],
          over70: [],
        };
        cpuRes.result.forEach((container: Container) => {
            if (container.value.value <= 30) {
                cpuValues.under30.push(container.value.value);
            }
            if (container.value.value > 30 && container.value.value < 70) {
                cpuValues.healthy.push(container.value.value);
            }
            if (container.value.value >= 70) {
                cpuValues.over70.push(container.value.value);
            }
        });
        const cpuPercentages = {
          under30Percent : cpuValues.under30.length / cpuRes.result.length * 100,
          healthyPercent : cpuValues.healthy.length / cpuRes.result.length * 100,
          over70Percent : cpuValues.over70.length / cpuRes.result.length * 100
        }
        console.log('under30%', )
        
        setStatus(`
        Current Status of Memory Usage:\n
        ${Math.round(memPercentages.under30Percent)}% of containers are using under 30% of the memory.\n
        ${Math.round(memPercentages.healthyPercent)}% of containers are healthy.\n
        ${Math.round(memPercentages.over70Percent)}% of containers are using over 70% of the memory.\n
        
        Current Status of CPU Usage:\n
        ${Math.round(cpuPercentages.under30Percent)}% of containers are using under 30% of the CPU.\n
        ${Math.round(cpuPercentages.healthyPercent)}% of containers are healthy.\n
        ${Math.round(cpuPercentages.over70Percent)}% of containers are using over 70% of the CPU.\n
        `);
    } catch (err) {
        console.log(err);
    }
};

  const getAvgCPUOverTime = async (id: string) => {
    try {
      const query = `avg_over_time(cpu_usage_percent{container_id="${id}",job="docker_stats"}[7d])`
      const res = await prom.instantQuery(query);
      const value = res.result[0].value.value.toFixed(3);

    } catch (err) {
      console.log(err);
    }
  };

  const getAvgMEMOverTime = async (id: string) => {
    try {
      const query = `avg_over_time(memory_usage_percent{container_id="${id}",job="docker_stats"}[7d])`;
      const res = await prom.instantQuery(query);
      const value = Number(res.result[0].value.value.toFixed(3));
      if (value >= 70) {
        setMEMSuggestion(`For the past 7 days, your Memory Usage Percent has been greater than or equal to 70%. 
        To optimize your container's resources, Dockasaurus RX recommends to create a Docker Swarm. 
        Docker Swarm offers many features to optimize your container's resources and performance such as automatic scaling, desired state reconciliation, load balancing and many more. 
        For more information, please refer to the Docker documentation here: https://docs.docker.com/engine/swarm/swarm-tutorial/`);
      };
      if (value <= 30) {
        setMEMSuggestion(`For the past 7 days, your Memory Usage Percent has been less than or equal to 30%.
        To optimize your container's resources, Dockasaurus RX recommends to lower the memory limit to about 40% of your current limit. 
        This will allow other containers that need more memory to perform better.
        To lower the memory limit for your container, you can run the command "docker run -m (number of bytes here)(b, k, m, g suffix here) (image or container ID here)".
        For more information, please refer to the Docker documentation here: https://docs.docker.com/config/containers/resource_constraints/`);
      }
      if (value > 30 && value <= 50) {
        setMEMSuggestion(`For the past 7 days, your Memory Usage Percent has been healthy, using between 30% to 50% of your memory.`);
      }
      if (value > 50 && value < 70) {
        setMEMSuggestion(`For the past 7 days, your Memory Usage Percent has been slightly higher than normal, using between 50% to 70% of your memory. Memory Usage may need to be optimized soon.`)
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
            Your Container At A Glance
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            blandit augue ut elit suscipit, in convallis dui tempus. Nulla
            facilisi. Suspendisse ultrices libero nec feugiat gravida. Sed
            pellentesque velit sit amet dolor pulvinar, id fringilla arcu
            vestibulum.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Item>
  );
};

export default Suggestions;
