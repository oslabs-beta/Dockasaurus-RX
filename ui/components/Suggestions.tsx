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
import '../../backend/server';



const Suggestions = ({id}: String) => {
  const prom: any = new PrometheusDriver({
    endpoint: "http://localhost:9090"
  });
  
  const getAvgCPUOverTime = async (id: string) => {
    try {
      const query = `avg_over_time(cpu_usage_percent{container_id="${id}",job="docker_stats"}[7d])`
      const res = await prom.instantQuery(query);
      return res.result[0].value.value.toFixed(3);
    } catch (err) {
      console.log(err);
    }
  };

  const getAvgMEMOverTime = async (id: string) => {
    try {
      const query = `avg_over_time(memory_usage_percent{container_id="${id}",job="docker_stats"}[7d])`
      const res = await prom.instantQuery(query);
      return res.result[0].value.value.toFixed(3);
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
