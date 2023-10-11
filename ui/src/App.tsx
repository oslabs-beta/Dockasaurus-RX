import React, { useState } from 'react';
import CardContainer from '../components/CardContainer';
import Suggestions from '../components/Suggestions';
import Item from '../components/Item';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import { useMenuState } from '../hooks/useMenuState';
import GraphData from '../components/GraphData';

export function App() {
  const { id, setId } = useMenuState();

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
                <GraphData />
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
