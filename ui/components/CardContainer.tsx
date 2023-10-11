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

export function useDockerDesktopClient() {
  return client;
}

const CardContainer = ({ setId }: any): any => {
  const ddClient = useDockerDesktopClient();
  const [search, setSearch] = useState('');
  const [containers, setContainers] = useState<Object[]>([]);
  const [update, setUpdate] = useState<boolean>(false);
  const forceUpdate = () => {
    setUpdate(!update);
  };
  useEffect(() => {
    getListOfContainers();
    setTimeout(() => {
      forceUpdate();
    }, 1000);
  }, [update]);

  const getListOfContainers = async (): Promise<void> => {
    try {
      let results = await ddClient.extension.vm?.service?.get('/getContainers');
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

  const displayContainers = containers
    .filter(
      (e: any) =>
        e.Name[0].toLowerCase().includes(search.toLowerCase()) ||
        e.Ports.map((p: any) =>
          p.PublicPort.toString().includes(search),
        ).includes(true),
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
              onClick={async () => {
                await ddClient.extension.vm?.service?.post(
                  `/api/filtergraph/${container.Id}`,
                  JSON.stringify({}),
                );
                (document.getElementById('iframe1') as HTMLImageElement).src = (
                  document.getElementById('iframe1') as HTMLImageElement
                ).src;
                (document.getElementById('iframe2') as HTMLImageElement).src = (
                  document.getElementById('iframe2') as HTMLImageElement
                ).src;

                setId(container.Id);
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
            {[39870, 39871, 39872]
              .map(e =>
                container.Ports.map((p: any) => p.PublicPort).includes(e),
              )
              .includes(true) ? (
              <div />
            ) : (
              <Button
                variant='text'
                onClick={async () => {
                  try {
                    await ddClient.extension.vm?.service?.post(
                      `/api/${container.Id}/start`,
                      {},
                    );
                    console.log('Container start request sent successfully');
                  } catch (error) {
                    console.error('Failed to start the container:', error);
                  }
                }}
                sx={{
                  textTransform: 'uppercase',
                  fonSize: '0.95em',
                  borderRadius: '20px',
                  padding: '0.35rem',
                  margin: '3px',
                }}>
                Run
              </Button>
            )}
            {[39870, 39871, 39872]
              .map(e =>
                container.Ports.map((p: any) => p.PublicPort).includes(e),
              )
              .includes(true) ? (
              <div />
            ) : (
              <Button
                variant='text'
                onClick={async () => {
                  try {
                    await ddClient.extension.vm?.service?.post(
                      `/api/${container.Id}/stop`,
                      {},
                    );
                    console.log('Container stop request sent successfully');
                  } catch (error) {
                    console.error('Failed to stop the container:', error);
                  }
                }}
                sx={{
                  textTransform: 'uppercase',
                  fonSize: '0.95em',
                  borderRadius: '20px',
                  padding: '0.35rem',
                  margin: '3px',
                }}>
                Stop
              </Button>
            )}
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
