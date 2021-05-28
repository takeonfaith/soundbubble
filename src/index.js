import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './functionality/AuthContext';
import { ModalClassProvider } from './functionality/ModalClass';
import { SongProvider } from './functionality/SongPlay/SongContext';
ReactDOM.render(
  
  <React.StrictMode>
    <AuthProvider>
      <SongProvider>
        <ModalClassProvider>
          <App />
        </ModalClassProvider>
      </SongProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
