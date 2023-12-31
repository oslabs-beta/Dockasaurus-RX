import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ExpandCircleDown } from '@mui/icons-material';
import Item from '../components/Item';
import { PrometheusDriver } from 'prometheus-query';
import { useState, useEffect } from 'react';
import '../../ui/css/style.css';

const Suggestions = ({ id }: any) => {
  const [MEMSuggestion, setMEMSuggestion] = useState<JSX.Element>(
    <Box>Please select a container to view optimization suggestions.</Box>,
  );
  const [CPUSuggestion, setCPUSuggestion] = useState<JSX.Element>(
    <Box>Please select a container to view optimization suggestions.</Box>,
  );
  const [status, setStatus] = useState<JSX.Element>(
    <Box>Please select a container to view your container at a glance.</Box>,
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
        <Box>
          <TableContainer>
            <Table aria-label='a dense table'>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Memory Usage</TableCell>
                  <TableCell align='center'>CPU Usage</TableCell>
                  <TableCell align='center'>Network I/O</TableCell>
                  <TableCell align='center'>PIDS</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align='center'>{memValue}%</TableCell>
                  <TableCell align='center'>{cpuValue}%</TableCell>
                  <TableCell align='center'>
                    {networkInVal}/{networkOutVal}
                  </TableCell>
                  <TableCell align='center'>{pidsVal}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>,
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getAvgCPUOverTime = async (id: string) => {
    try {
      const query = `avg_over_time(cpu_usage_percent{container_id="${id}",job="docker_stats"}[7d])`;
      const res = await prom.instantQuery(query);

      const value = Number(res.result[0].value.value.toFixed(2));
      if (value >= 70) {
        setCPUSuggestion(
          <Box>
            <Typography className='optimizeContent'>
              This container environment's CPU utilization is <b>EXCESSIVE</b>.
              <p></p>
              For the past <b>7 days</b>, this container maintained a CPU Usage
              Percent consistently <b>greater than or equal to 70%</b>, with an{' '}
              <b>average of {value}%</b>.<p></p>To optimize this container's
              resources, consider creating a Docker Swarm. Docker Swarm offers
              automatic scaling, desired state reconciliation, and load
              balancing.
              <br></br>
              <br></br>
            </Typography>
            <Typography variant='caption'>
              <b>
                For a tutorial on Docker Swarm, please refer to the Docker
                documentation at the link below:
              </b>
              <br></br>
              https://docs.docker.com/engine/swarm/swarm-tutorial/
            </Typography>
          </Box>,
        );
      }
      if (value <= 30) {
        setCPUSuggestion(
          <Box>
            <Typography className='optimizeContent'>
              Over the past <b>7 days</b>, this container has maintained a CPU
              Usage Percentage consistently <b>at or below 30%</b>, with an{' '}
              <b>average usage of {value}%</b>.<p></p>Lower your CPU Limit to
              ~40% of the current limit to enhance the performance of other
              containerized environments, consider reducing this container's CPU
              Limit. To reduce the CPU Limit of this container, run the
              following command:
              <br></br>
              <br></br>
              <br></br>
              <center>
                <TextField
                  defaultValue='docker run --cpus=[number of bytes here] [image or container ID here]'
                  variant='outlined'
                  size='small'
                  sx={{ width: '77%' }}
                />
              </center>
              <br></br>
              <br></br>
            </Typography>
            <Typography variant='caption'>
              <b>
                For further information, please refer to the Docker
                documentation below:
              </b>
              <br></br>
              https://docs.docker.com/config/containers/resource_constraints/
            </Typography>
          </Box>,
        );
      }
      if (value > 30 && value <= 50) {
        setCPUSuggestion(
          <Box>
            Over the past <b>7 days</b>, your CPU Usage Percent has been{' '}
            <b>HEALTHY</b>, trending between 30% to 50% of your CPU, averaging
            at {value}%.
          </Box>,
        );
      }
      if (value > 50 && value < 70) {
        setCPUSuggestion(
          <Box>
            Over the past <b>7 days</b>, your CPU Usage Percent has been
            slightly <b>ELEVATED</b>, trending between 50% to 70% of your CPU,{' '}
            <b>averaging at {value}%</b>. CPU Usage may need to be optimized
            soon.
          </Box>,
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
        setMEMSuggestion(
          <Box>
            <Typography className='optimizeContent'>
              This container environment's CPU utilization is <b>EXCESSIVE</b>.
              <p></p>
              Over the past <b>7 days</b>, this container maintained a Memory
              Usage Percent consistently <b>greater than or equal to 70%</b>,
              with an <b>average of {value}%</b>.<p></p> To optimize this
              container's resources, consider creating a Docker Swarm. Docker
              Swarm offers automatic scaling, desired state reconciliation, and
              load balancing.
              <br></br>
              <br></br>
            </Typography>
            <Typography variant='caption'>
              <b>
                For a tutorial on Docker Swarm, please refer to the Docker
                documentation at the link below:
              </b>
              <br></br>
              https://docs.docker.com/engine/swarm/swarm-tutorial/
            </Typography>
          </Box>,
        );
      }
      if (value <= 30) {
        setMEMSuggestion(
          <Box>
            <Typography className='optimizeContent'>
              Over the past <b>7 days</b>, this container has maintained a
              Memory Usage Percentage consistently <b>at or below 30%</b>, with
              an <b>average usage of {value}%</b>.<p></p>To enhance the
              performance of other containerized environments, consider reducing
              this container's Memory Limit. To reduce the Memory Limit of this
              container, run the following command:
              <br></br>
              <br></br>
              <br></br>
              <center>
                <TextField
                  defaultValue='docker run -m [number of bytes][b, k, m, g suffix] [image or container ID]'
                  variant='outlined'
                  size='small'
                  sx={{ width: '77%' }}
                />
              </center>
              <br></br>
              <br></br>
            </Typography>
            <Typography variant='caption'>
              <b>
                For further information, please refer to the Docker
                documentation below:
              </b>
              <br></br>
              https://docs.docker.com/config/containers/resource_constraints/
            </Typography>
          </Box>,
        );
      }
      if (value > 30 && value <= 50) {
        setMEMSuggestion(
          <Box>
            Over the past <b>7 days</b>, your Memory Usage Percent has been{' '}
            <b>HEALTHY</b>, using between 30% to 50% of your memory,{' '}
            <b>averaging at {value}%</b>.
          </Box>,
        );
      }
      if (value > 50 && value < 70) {
        setMEMSuggestion(
          <Box>
            Over the past <b>7 days</b>, your Memory Usage Percent has been
            slightly
            <b>ELEVATED</b>, using between 50% to 70% of your memory,
            <b>averaging at {value}%</b>. Memory Usage may need to be optimized
            soon.
          </Box>,
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
            At A Glance
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
            Memory Utilization
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body1' color='text.secondary'>
            <Box>{MEMSuggestion}</Box>
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
            CPU Utilization
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
