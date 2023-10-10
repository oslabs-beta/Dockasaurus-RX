import React from 'react';
import StyledMenu from './StyledMenu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Button,
  MenuItem,
  Divider
} from '@mui/material';
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
        height='300'
        style={{ width: '100%', border: '0'}}
      />
      <div>
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
            fonSize: '0.95em',
            borderRadius: '20px',
            padding: '0.35rem',
            margin: '3px',
          }}>
          View
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
        height='300'
        style={{ width: '100%', border: '0'}}
      />
    </div>
  );
};

export default GrafanaData;
