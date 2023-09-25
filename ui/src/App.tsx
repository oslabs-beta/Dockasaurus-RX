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

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [response, setResponse] = React.useState<string>();
  const ddClient = useDockerDesktopClient();
  const [containers, setContainers] = useState<React.ReactElement[]>();

  useEffect(() => {
    sendMessageToTextBox();
  }, []);

  const sendMessageToTextBox = async () => {
    try {
      let results = await ddClient.extension.vm?.service?.get('/test');
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
            <Button key={container}>{container}</Button>
          )),
        );
      } else {
        throw new Error('The "results" variable must be an array of Objects');
      }
    } catch (err) {
      throw new Error();
    }
  };

  const fetchAndDisplayResponse = async () => {
    const result = await ddClient.extension.vm?.service?.get('/hello');
    setResponse(JSON.stringify(result));
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    height: '100%',
  }));

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
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box
              sx={{
                boxShadow: '4px 4px 7px 0px rgba(0, 0, 0, .25)',
                padding: '0rem',
                height: '100%',
              }}>
              <Item>Container Panel: {containers}</Item>
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box
              sx={{
                flexGrow: 0,
                boxShadow: '4px 4px 7px 0px rgba(0, 0, 0, .25)',
                padding: '0rem',
                height: '100%',
              }}>
              <Item>
                <Accordion>
                  <AccordionSummary
                    aria-controls='panel2a-content'
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
