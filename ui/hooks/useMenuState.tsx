import { useState } from 'react';

type Views = '5m' | '15m' | '30m' | '1hr' | '3hr' | '6hr' | '24h' | '1d';

export const useMenuState = () => {
  const [id, setId] = useState<string>('');
  const [containerID, setcontainerID] = useState<string>('');

  const [view, setView] = useState<Views>('15m');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  return {
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
  };
};
