import StyledMenu from './StyledMenu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, Divider, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useMenuState } from '../hooks/useMenuState';
import { useDockerDesktopClient } from './CardContainer';
import '../../ui/css/style.css';

const GrafanaData = () => {
  let mediaQueryObj = window.matchMedia('(prefers-color-scheme: dark)');
  let isDarkMode = mediaQueryObj.matches;
  const {
    id,
    setId,
    containerID,
    setcontainerID,
    view,
    setView,
    anchorEl,
    setAnchorEl,
    open,
    handleClick,
    handleViewClick,
    handleClose,
  } = useMenuState();

  const ddClient = useDockerDesktopClient();

  const handleSelectAllClick = async () => {
    console.log('Sending request to backend');
    await ddClient.extension.vm?.service?.delete(`/api/filtergraph/`);
    (document.getElementById('iframe1') as HTMLImageElement).src = (
      document.getElementById('iframe1') as HTMLImageElement
    ).src;
    (document.getElementById('iframe2') as HTMLImageElement).src = (
      document.getElementById('iframe2') as HTMLImageElement
    ).src;
  };
  const refreshGraphs = () => {
    (document.getElementById('iframe1') as HTMLImageElement).src = (
      document.getElementById('iframe1') as HTMLImageElement
    ).src;
    (document.getElementById('iframe2') as HTMLImageElement).src = (
      document.getElementById('iframe2') as HTMLImageElement
    ).src;
    setTimeout(() => {
      refreshGraphs();
    }, 60000);
  };
  useEffect(() => {
    refreshGraphs();
  }, []);
  return (
    <>
      <Box
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          height: '90%',
        }}>
        <iframe
          className='framed'
          id='iframe1'
          src={`http://localhost:39872/d-solo/b6cb1312-2136-4c9b-b59a-e45ff2fce572/container-metrics?orgId=1&to=now&theme=${
            isDarkMode ? 'dark' : 'light'
          }&panelId=2&from=now-${view}`}
        />

        <iframe
          className='framed'
          id='iframe2'
          src={`http://localhost:39872/d-solo/b6cb1312-2136-4c9b-b59a-e45ff2fce572/container-metrics?orgId=1&to=now&theme=${
            isDarkMode ? 'dark' : 'light'
          }&panelId=1&from=now-${view}`}
        />
      </Box>
      <Button
        id='time-button'
        aria-controls={open ? 'customized-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        variant='text'
        sx={{
          textTransform: 'uppercase',
          fontSize: '0.90em',
          borderRadius: '35px',
          padding: '0.35rem',
          margin: '5px',
        }}>
        Select Time Period
      </Button>
      <StyledMenu
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        <MenuItem value={'5m'} onClick={handleViewClick} disableRipple>
          5 minutes
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem value={'15m'} onClick={handleViewClick} disableRipple>
          15 minutes
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem value={'30m'} onClick={handleViewClick} disableRipple>
          30 minutes
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem value={'1d'} onClick={handleViewClick} disableRipple>
          Last 24 hours
        </MenuItem>
      </StyledMenu>
      <Button
        id='time-button'
        // aria-controls={open ? 'customized-menu' : undefined}
        // aria-haspopup='true'
        // aria-expanded={open ? 'true' : undefined}
        // disableElevation
        onClick={handleSelectAllClick}
        variant='text'
        sx={{
          textTransform: 'uppercase',
          fontSize: '0.90em',
          borderRadius: '35px',
          padding: '0.35rem',
          margin: '5px',
        }}>
        Select All Containers
      </Button>
    </>
  );
};

export default GrafanaData;
