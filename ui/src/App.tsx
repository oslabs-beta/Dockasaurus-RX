import React, { useState } from 'react';
import CardContainer from '../components/CardContainer';
import Suggestions from '../components/Suggestions';
import Item from '../components/Item';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

type Views = '5m' | '15m' | '30m' | '1hr' | '3hr' | '6hr' | '24h' | '1d';

export function App() {
  const [id, setId] = useState<String>('');
  const [containerID, setcontainerID] = useState<string>('');

  const [view, setView] = useState<Views>('15m');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleViewClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
    const selectedValue = event.currentTarget.getAttribute('value');
    if (selectedValue) {
      setView(selectedValue as Views);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
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
                  src={`http://localhost:42069/d-solo/b6cb1312-2136-4c9b-b59a-e45ff2fce572/container-metrics?orgId=1&from=now-${view}&to=now&theme=dark&panelId=2`}
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
                    endIcon={<KeyboardArrowDownIcon />}>
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
                    <MenuItem
                      value={'5m'}
                      onClick={handleViewClick}
                      disableRipple>
                      Last 5 minutes
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem
                      value={'15m'}
                      onClick={handleViewClick}
                      disableRipple>
                      Last 15 minutes
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem
                      value={'30m'}
                      onClick={handleViewClick}
                      disableRipple>
                      Last 30 minutes
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem
                      value={'1d'}
                      onClick={handleViewClick}
                      disableRipple>
                      Last 24 hours
                    </MenuItem>
                  </StyledMenu>
                </div>
                <iframe
                  src={`http://localhost:42069/d-solo/b6cb1312-2136-4c9b-b59a-e45ff2fce572/container-metrics?orgId=1&from=now-${view}&to=now&theme=dark&panelId=1`}
                  width='600'
                  height='300'
                  style={{ border: 0 }}
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
