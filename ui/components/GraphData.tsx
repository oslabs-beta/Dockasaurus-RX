import React from 'react';
import StyledMenu from './StyledMenu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useMenuState } from '../hooks/useMenuState';

const GrafanaData = () => {
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

  return (
    <div>
      <iframe
        id='iframe1'
        src={`http://localhost:40001/d-solo/b6cb1312-2136-4c9b-b59a-e45ff2fce572/container-metrics?orgId=1&to=now&theme=dark&panelId=2&from=now-${view}`}
        width='600'
        height='300'
        style={{ border: 0 }}
      />
      <div>
        <Button
          id='time-button'
          aria-controls={open ? 'customized-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          variant='contained'
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
        >
          View
        </Button>
        <StyledMenu
          id='demo-customized-menu'
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem value={'5m'} onClick={handleViewClick} disableRipple>
            Last 5 minutes
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem value={'15m'} onClick={handleViewClick} disableRipple>
            Last 15 minutes
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem value={'30m'} onClick={handleViewClick} disableRipple>
            Last 30 minutes
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem value={'1d'} onClick={handleViewClick} disableRipple>
            Last 24 hours
          </MenuItem>
        </StyledMenu>
      </div>
      <iframe
        id='iframe2'
        src={`http://localhost:40001/d-solo/b6cb1312-2136-4c9b-b59a-e45ff2fce572/container-metrics?orgId=1&to=now&theme=dark&panelId=1&from=now-${view}`}
        width='600'
        height='300'
        style={{ border: 0 }}
      />
    </div>
  );
};

export default GrafanaData;
