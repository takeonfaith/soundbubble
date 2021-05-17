import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './functionality/AuthContext';
import { SongProvider } from './functionality/SongPlay/SongContext';
ReactDOM.render(
  
  <React.StrictMode>
    <AuthProvider>
      <SongProvider>
        <App />
      </SongProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
