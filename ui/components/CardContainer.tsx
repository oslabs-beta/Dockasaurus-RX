import React, { useState, useEffect } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Card, CardContent, Typography, Button } from '@mui/material';
import '../../ui/css/style.css';

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

const CardContainer = (): any => {
  const ddClient = useDockerDesktopClient();
  const [search, setSearch] = useState('');
  const [containers, setContainers] = useState<Object[]>([]);
  console.log(search);
  const testclick = async () => {
    const result = await ddClient.extension.vm?.service?.get('/test2');
    console.log(result);
  };
  useEffect(() => {
    sendMessageToTextBox();
  }, []);

  const sendMessageToTextBox = async (): Promise<void> => {
    try {
      let results = await ddClient.extension.vm?.service?.get('/test');
      if (results === null) throw new Error();

      if (
        Array.isArray(results) &&
        results.every(item => typeof item === 'object')
      ) {
        setContainers(results);
      } else {
        throw new Error('The "results" variable must be an array of Objects');
      }
    } catch (err) {
      throw new Error();
    }
  };
  console.log(containers);
  console.log(containers.filter((e: any) => e.Name[0].includes(search)));

  const displayContainers = containers
    .filter(
      (e: any) =>
        e.Name[0].includes(search) ||
        e.Ports.map((p: any) => p.PublicPort).includes(Number(search)),
    )
    .map((container: any) => {
      return (
        <Card variant='outlined' className='card'>
          <CardContent className='cardContent'>
            <Typography variant='subtitle1' color='text.primary'>
              {container.Name}
            </Typography>
            <Typography color='text.secondary'>
              <b>Status:</b> {container.Status}
            </Typography>
            <Typography color='text.secondary'>
              <b>Port:</b> 8080
            </Typography>
            <br />

            <Button
              variant='text'
              onClick={testclick}
              sx={{
                textTransform: 'uppercase',
                fonSize: '0.95em',
                borderRadius: '20px',
                padding: '0.35rem',
                margin: '3px',
              }}>
              Select
            </Button>
            <Button
              variant='text'
              onClick={testclick}
              sx={{
                textTransform: 'uppercase',
                fonSize: '0.95em',
                borderRadius: '20px',
                padding: '0.35rem',
                margin: '3px',
              }}>
              Run
            </Button>
          </CardContent>
        </Card>
      );
    });
  return (
    <div
      className='containersDiv'
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
      }}>
      <input
        onChange={e => {
          setSearch(e.target.value);
        }}></input>
      {displayContainers}
    </div>
  );
};

export default CardContainer;
