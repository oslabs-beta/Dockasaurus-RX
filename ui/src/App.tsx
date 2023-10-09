import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import CardContainer from '../components/CardContainer';
import Suggestions from '../components/Suggestions';
import Item from '../components/Item';
import { useState } from 'react';

export function App() {
  const [id, setId] = useState<String>('');
  return (
    <>
      <Box sx={{ flexGrow: 1, height: '100%' }}>
        <Grid container spacing={3} style={{ height: '98vh' }}>
          <Grid xs={12} md={12}>
            <Box
              sx={{
                boxShadow: '4px 4px 7px 0px rgba(0, 0, 0, .25)',
                padding: '0rem',
                height: '100%',
              }}>
              <Item>
                <iframe
                  src={`http://localhost:40001/d-solo/b6cb1312-2136-4c9b-b59a-e45ff2fce572/container-metrics?orgId=1&from=now-${'15m'}&to=now&theme=dark&panelId=2`}
                  // width='600'
                  // height='300'
                  style={{ width: '50%', border: '0' }}
                />
                <iframe
                  src={`http://localhost:40001/d-solo/b6cb1312-2136-4c9b-b59a-e45ff2fce572/container-metrics?orgId=1&from=now-${'15m'}&to=now&theme=dark&panelId=1`}
                  // width='600'
                  // height='300'
                  style={{ width: '50%', border: '0' }}
                />
              </Item>
            </Box>
          </Grid>
          <Grid xs={12} md={7}>
            <Box
              sx={{
                boxShadow: '4px 4px 7px 0px rgba(0, 0, 0, .25)',
                padding: '0rem',
                height: '100%',
              }}>
              <Item>
                <CardContainer setId={setId} />
              </Item>
            </Box>
          </Grid>
          <Grid xs={12} md={5}>
            <Box
              sx={{
                boxShadow: '4px 4px 7px 0px rgba(0, 0, 0, .25)',
                padding: '0rem',
                height: '100%',
              }}>
              <Suggestions id={id} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
