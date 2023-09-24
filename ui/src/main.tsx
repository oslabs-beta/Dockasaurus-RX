<<<<<<< HEAD
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
=======
import React from 'react';
import ReactDOM from 'react-dom/client';
// import CssBaseline from '@mui/material/CssBaseline';
// import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { ChakraProvider } from '@chakra-ui/react';
>>>>>>> frontend/justin

import { App } from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/*
      If you eject from MUI (which we don't recommend!), you should add
      the `dockerDesktopTheme` class to your root <html> element to get
      some minimal Docker theming.
    */}
    <ChakraProvider>
      <App />
    </ChakraProvider>
<<<<<<< HEAD
  </React.StrictMode>
=======
  </React.StrictMode>,
>>>>>>> frontend/justin
);
