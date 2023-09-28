import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import CardContainer from '../components/CardContainer';
import Suggestions from '../components/Suggestions';
import Item from '../components/Item'

export function App() {
>>>>>>> 5c8ed917919fcf2e5268a798404f4449656649c0

  // const stats = async () => {
  //   try {
  //     const result = await ddClient.extension.vm?.service?.get('/stats');
  //     console.log(result);
  //     // setContainerStats(result);
  //     return result;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
              <Item>Dashboard Panel:</Item>
              <h6>{graphData}</h6>
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
                <CardContainer />
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
              <Suggestions />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
