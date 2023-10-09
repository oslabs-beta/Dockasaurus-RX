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



const Suggestions = ({id}: any) => {
  const [MEMSuggestion, setMEMSuggestion] = useState<String>('Please select a container to view optimization suggestions.')
  const prom: any = new PrometheusDriver({
    endpoint: "http://localhost:9090"
  });
  
  useEffect(() => {
    getAvgMEMOverTime(id);
  })

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
      if (value >= 80) {
        setMEMSuggestion(`For the past 7 days, your Memory Usage Percent has been greater than or equal to 80%. 
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
            Optimization Suggestion 1
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
          aria-controls='panel2a-content'
          id='panel2a-header'>
          <Typography
            sx={{
              fontSize: 16,
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
            color='text.primary'>
            Optimization Suggestion 2
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
            Optimization Suggestion 3
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
