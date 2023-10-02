import React, { useState, useEffect } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Card, CardContent, Typography, Button } from '@mui/material';
import '../../ui/css/style.css';

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

const CardContainer = () => {
  const ddClient = useDockerDesktopClient();
  const [containers, setContainers] = useState<React.ReactElement[]>([]);
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
        setContainers(
          results.map(container => (
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
    <div
      className='containersDiv'
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
      }}>
      {containers}
    </div>
  );
};

export default CardContainer;
