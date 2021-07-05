import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './functionality/AuthContext';
import { ModalClassProvider } from './functionality/ModalClass';
import { ScreenProvider } from './functionality/ScreenContext';
import { SongProvider } from './functionality/SongPlay/SongContext';
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
