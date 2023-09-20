import React from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, TextField, Typography } from '@mui/material';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [response, setResponse] = React.useState<string>();
  const ddClient = useDockerDesktopClient();

  return (
    <>
      <Typography variant='h3'>Docker extension demo</Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
        This is a basic page rendered with MUI, using Docker's theme. Read the
        MUI documentation to learn more. Using MUI in a conventional way and
        avoiding custom styling will help make sure your extension continues to
        look great as Docker's theme evolves.
      </Typography>
      <Typography>Test</Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
        Click this button to test IFrame:
      </Typography>
      <Stack direction='row' alignItems='start' spacing={2} sx={{ mt: 4 }}>
        <Button variant='contained' /*onClick={fetchAndDisplayResponse}*/>
          IFrame
        </Button>

        <iframe
          src='https://www.sdrive.app/embed/1ptBQD'
          width='640px'
          height='320px'
          id=''
          className='test'></iframe>
      </Stack>
    </>
  );
}
