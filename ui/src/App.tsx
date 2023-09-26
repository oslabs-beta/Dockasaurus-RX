import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { ExpandCircleDown } from '@mui/icons-material';

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

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const ddClient = useDockerDesktopClient();
  const [containers, setContainers] = useState<React.ReactElement[]>();
  const [graphData, setGraphData] = useState<any>();

  useEffect(() => {
    sendMessageToTextBox();
  }, []);

  const getContainerStats = async (Id: string): Promise<Object | void> => {
    try {
      const response = (await ddClient.extension.vm?.service?.get(
        `/api/stats/${Id}`,
      )) as Response;
      const data = await response.json();
      const dataString = JSON.stringify(data, null, 2);
      setGraphData(dataString);
    } catch (error: any) {
      console.log(error);
    }
  };

  const sendMessageToTextBox = async () => {
    try {
      let results = await ddClient.extension.vm?.service?.get('/test');
      console.log(results);
      if (results === null) throw new Error();
      // console.log(result);
      // idk this is type script bs to check the response and make sure its an array
      if (
        Array.isArray(results) &&
        results.every(item => typeof item === 'object')
      ) {
        //set state of containers to an array of buttons, removes the first character which is a forward slash
        setContainers(
          results.map(container => (
            <Card
              variant='outlined'
              style={{
                margin: '7px',
                padding: '10px 7px 0px 7px',
                width: '29%',
                minWidth: '100px',
              }}>
              <CardContent
                sx={{
                  textTransform: 'uppercase',
                  padding: '.5rem',
                  margin: '0px',
                }}>
                <Typography
                  sx={{
                    fontSize: 16,
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                  }}
                  color='text.primary'>
                  {container.Name}
                </Typography>
                <Typography sx={{ fontSize: 13 }} color='text.secondary'>
                  Status: {container.Status}
                </Typography>
                <Typography sx={{ fontSize: 13 }} color='text.secondary'>
                  {'Port: 8080'}
                </Typography>
                <br></br>
                <Button
                  variant='text'
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '.95em',
                    borderRadius: '20px',
                    padding: '.35rem',
                    margin: '3px',
                  }}>
                  More
                </Button>
                <Button
                  onClick={() => {
                    getContainerStats(container.Id);
                  }}
                  variant='text'
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '.95em',
                    borderRadius: '20px',
                    padding: '.35rem',
                    margin: '3px',
                  }}>
                  Select
                </Button>
                <Button
                  variant='text'
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '.95em',
                    borderRadius: '20px',
                    padding: '.35rem',
                    margin: '3px',
                  }}>
                  Run
                </Button>
              </CardContent>
            </Card>
          )),
        );
      } else {
        throw new Error('The "results" variable must be an array of Objects');
      }
    } catch (err) {
      throw new Error();
    }
  };

  // const fetchAndDisplayResponse = async () => {
  //   const result = await ddClient.extension.vm?.service?.get('/hello');
  //   setResponse(JSON.stringify(result));
  // };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    height: '100%',
  }));

  // const stats = async () => {
  //   try {
  //     const result = await ddClient.extension.vm?.service?.get('/stats');
  //     console.log(result);
  //     // setContainerStats(result);
  //     return result;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <>
      {/* <Typography variant="h3">Docker extension demo</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This is a basic page rendered with MUI, using Docker's theme. Read the
        MUI documentation to learn more. Using MUI in a conventional way and
        avoiding custom styling will help make sure your extension continues to
        look great as Docker's theme evolves.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Pressing the below button will trigger a request to the backend. Its
        response will appear in the textarea.
      </Typography>
      <Stack direction="row" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" onClick={fetchAndDisplayResponse}>
          Call backend
        </Button>

        <TextField
          label="Backend response"
          sx={{ width: 480 }}
          disabled
          multiline
          variant="outlined"
          minRows={5}
          value={response ?? ''}
        />
      </Stack> */}

      <Box sx={{ flexGrow: 1, height: '100%' }}>
        <Grid container spacing={3} style={{ height: '98vh' }}>
          <Grid xs={12} md={12}>
            <Box
              sx={{
                boxShadow: '4px 4px 7px 0px rgba(0, 0, 0, .25)',
                padding: '0rem',
                height: '100%',
              }}>
              <Item>Dashboard Panel:</Item>
              <h6>{graphData}</h6>
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box
              sx={{
                boxShadow: '4px 4px 7px 0px rgba(0, 0, 0, .25)',
                padding: '0rem',
                height: '100%',
              }}>
              <Item
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                }}>
                {containers}
              </Item>
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box
              sx={{
                boxShadow: '4px 4px 7px 0px rgba(0, 0, 0, .25)',
                padding: '0rem',
                height: '100%',
              }}>
              <Item>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandCircleDown />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'>
                    <Typography>Optimization Suggestion 1</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='caption'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed ac semper enim. Nullam consectetur, orci eget aliquet
                      consectetur, elit mauris lacinia elit, ut luctus sem quam
                      vitae nunc. Fusce id urna at nunc tincidunt mollis.
                      Integer nec velit et mauris feugiat fermentum. Sed sed
                      urna id enim lacinia lacinia. Sed euismod, ipsum sed
                      tincidunt tincidunt, nisl ligula tristique risus, vel
                      efficitur lectus neque id neque.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandCircleDown />}
                    aria-controls='panel2a-content'
                    id='panel2a-header'>
                    <Typography>Optimization Suggestion 2</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='caption'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed ac semper enim. Nullam consectetur, orci eget aliquet
                      consectetur, elit mauris lacinia elit, ut luctus sem quam
                      vitae nunc. Fusce id urna at nunc tincidunt mollis.
                      Integer nec velit et mauris feugiat fermentum. Sed sed
                      urna id enim lacinia lacinia. Sed euismod, ipsum sed
                      tincidunt tincidunt, nisl ligula tristique risus, vel
                      efficitur lectus neque id neque.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandCircleDown />}
                    aria-controls='panel3a-content'
                    id='panel3a-header'>
                    <Typography>Optimization Suggestion 3</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='caption'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed ac semper enim. Nullam consectetur, orci eget aliquet
                      consectetur, elit mauris lacinia elit, ut luctus sem quam
                      vitae nunc. Fusce id urna at nunc tincidunt mollis.
                      Integer nec velit et mauris feugiat fermentum. Sed sed
                      urna id enim lacinia lacinia. Sed euismod, ipsum sed
                      tincidunt tincidunt, nisl ligula tristique risus, vel
                      efficitur lectus neque id neque.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Item>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
