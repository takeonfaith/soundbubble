import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { AuthProvider } from './contexts/auth';
import { ModalClassProvider } from './contexts/modal';
import { ScreenProvider } from './contexts/screen';
import { SongProvider } from './contexts/song';
ReactDOM.render(
  <React.StrictMode>
    <ScreenProvider>
      <AuthProvider>
        <ModalClassProvider>
          <SongProvider>
            <App />
          </SongProvider>
        </ModalClassProvider>
      </AuthProvider>
    </ScreenProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
