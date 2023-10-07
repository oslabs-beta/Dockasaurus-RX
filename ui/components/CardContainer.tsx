import React, { useState, useEffect } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import '../../ui/css/style.css';

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

const CardContainer = ({setId}: any): any => {
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
  // console.log(containers);
  // console.log(containers.filter((e: any) => e.Name[0].includes(search)));
  console.log(containers);
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
              <b>Port:</b>{' '}
              {container.Ports.map((e: any) => {
                return e['PublicPort'];
              }).toString()}
            </Typography>
            <br />

            <Button
              variant='text'
              onClick={() => {
                setId(container.Id)
              }}
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
    <>
      <div
        className='containersDiv'
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}>
        <TextField
          style={{ width: '96%', margin: '4px 0px 10px 0px' }}
          variant='outlined'
          label='Search by Name/Port'
          onChange={e => {
            setSearch(e.target.value);
          }}></TextField>
        {displayContainers}
      </div>
    </>
  );
};

export default CardContainer;
