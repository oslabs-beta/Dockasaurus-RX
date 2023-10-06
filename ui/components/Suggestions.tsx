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

const prom: any = new PrometheusDriver({
  endpoint: "https://host.docker.internal:9090"
})

const getAvgOverTime = async (range: string, vector: string) => {
  const query = `avg_over_time(${range}[${vector}])`
  const result = await prom.instantQuery(query);
  return result;
};
console.log('avgOverTime', getAvgOverTime('cpu_usage_percent', '1h:0m'))


const Suggestions = () => {
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
