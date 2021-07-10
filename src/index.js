import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ModalClassProvider } from './contexts/ModalContext';
import { ScreenProvider } from './contexts/ScreenContext';
import { SongProvider } from './contexts/SongContext';
ReactDOM.render(
  <React.StrictMode>
    <ScreenProvider>
      <AuthProvider>
        <SongProvider>
          <ModalClassProvider>
            <App />
          </ModalClassProvider>
        </SongProvider>
      </AuthProvider>
    </ScreenProvider>
  </React.StrictMode>,
  document.getElementById('root')
);