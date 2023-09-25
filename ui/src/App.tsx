import React, { useState, useEffect } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, TextField, Typography } from '@mui/material';
import { Text } from '@chakra-ui/react';
import { Button, ButtonGroup, Box } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import { Grid, GridItem } from '@chakra-ui/react';
import { Center } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react';
import {
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/react';
// import '../../ui/css/style.css';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App(): any {
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

  return (
    <>
      {/* <Typography variant='h3'>Docker extension demo</Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
        This is a basic page rendered with MUI, using Docker's theme. Read the
        MUI documentation to learn more. Using MUI in a conventional way and
        avoiding custom styling will help make sure your extension continues to
        look great as Docker's theme evolves.
      </Text>
      <Text fontSize='sm'>
        Pressing the below button will trigger a request to the backend. Its
        response will appear in the textarea.
      </Typography>
      <Stack direction='row' alignItems='start' spacing={2} sx={{ mt: 4 }}>
        <Button variant='contained' onClick={sendMessageToTextBox}>
          Call backend
        </Button>

        <Textarea
          placeholder='Backend response'
          size='md'
          value={response ?? ''}
        />
      </Stack> */}
      <Box bg='gray.200'>
        <Grid
          templateRows='repeat(2, 2fr)'
          templateColumns='repeat(2, 2fr)'
          gap={8}
          p='10'
          h='100vh'
          color='blackAlpha'>
          <GridItem colSpan={2} bg='white' boxShadow='md' p='6' rounded='md'>
            Grafana Dashboard:
          </GridItem>
          <GridItem colSpan={1} bg='white' boxShadow='md' p='6' rounded='md'>
            Container Selection Panel:
            {containers}
          </GridItem>
          <GridItem colSpan={1} bg='white' boxShadow='md' p='6' rounded='md'>
            Suggestions Panel:
            <Accordion>
              <AccordionItem>
                <h2>
                  <AccordionButton
                    _expanded={{ bg: 'green.500', color: 'white' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      Resource Optimization 1
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton
                    _expanded={{ bg: 'green.400', color: 'white' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      Resource Optimization 2
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton
                    _expanded={{ bg: 'green.300', color: 'white' }}>
                    <Box as='span' flex='1' textAlign='left'>
                      Resource Optimization 3
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
