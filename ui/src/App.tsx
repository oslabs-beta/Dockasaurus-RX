import React from 'react';
import { Text } from '@chakra-ui/react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, HStack, VStack, StackDivider } from '@chakra-ui/react';
import { Button, ButtonGroup, Box } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import { Grid, GridItem } from '@chakra-ui/react';
import { Center } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react';
import { Accordion, AccordionItem, AccordionIcon, AccordionButton, AccordionPanel } from '@chakra-ui/react';
import '../../ui/css/style.css';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App(): any {
  const [response, setResponse] = React.useState<string>();
  const ddClient = useDockerDesktopClient();

  const sendMessageToTextBox = async () => {
    const result = await ddClient.extension.vm?.service?.get('/test');
    console.log(result);
    setResponse(JSON.stringify(result));
  const sendMessageToTextBox = async () => {
    const result = await ddClient.extension.vm?.service?.get('/test');

    const responseText = await result.text();
    setResponse(responseText);
  };

  return (
    <>
      {/* <Text fontSize='3xl'>Docker extension demo</Text>
      <Text fontSize='sm'>
        This is a basic page rendered with MUI, using Docker's theme. Read the
        MUI documentation to learn more. Using MUI in a conventional way and
        avoiding custom styling will help make sure your extension continues to
        look great as Docker's theme evolves.
      </Text>
      <Text fontSize='sm'>
        Pressing the below button will trigger a request to the backend. Its
        response will appear in the textarea.
      </Text>
      <VStack spacing='24px'>
        <Button colorScheme='blackAlpha' variant='outline' onClick={fetchAndDisplayResponse}>
          Call backend
        </Button>

        <Textarea
          placeholder='Backend response'
          size='md'
          value={response ?? ''}
        />
      </VStack>
      <VStack
  divider={<StackDivider borderColor='gray.200' />}
  spacing={4}
  align='stretch'
>
  <Box h='40px' bg='yellow.200'>
    1
  </Box>
  <Box h='40px' bg='tomato'>
    2
  </Box>
  <Box h='40px' bg='pink.100'>
    3
  </Box>
</VStack> */}
      {/* <Grid
  h='700'
  templateRows='repeat(3, 1fr)'
  templateColumns='repeat(5, 1fr)'
  gap={4}
>
  <GridItem rowSpan={3} colSpan={1} bg='tomato' />
  <GridItem colSpan={1} bg='orange.300' />
  <GridItem colSpan={1} bg='papayawhip' />
  <GridItem colSpan={1} bg='pink.300' />
  <GridItem colSpan={1} bg='yellow.300' />
  <GridItem colSpan={2} bg='green.200' />
  <GridItem colSpan={2} bg='blue.300' />
  <GridItem colSpan={2} bg='gray.200' />  position='relative'
  <GridItem colSpan={2} bg='purple.300' /> bg='tomato' p='4' color='white' axis='both'
</Grid> */}
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
          </GridItem>
          <GridItem colSpan={1} bg='white' boxShadow='md' p='6' rounded='md'>
            Suggestions Panel:
            <Accordion>
              <AccordionItem>
                <h2>
                  <AccordionButton _expanded={{ bg: 'green.500', color: 'white' }}>
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
                  <AccordionButton _expanded={{ bg: 'green.400', color: 'white' }}>
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
                  <AccordionButton _expanded={{ bg: 'green.300', color: 'white' }}>
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
