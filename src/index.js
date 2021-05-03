import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SongProvider } from './functionality/SongPlay/SongContext';

ReactDOM.render(
  
  <React.StrictMode>
    <SongProvider>
      <App />
    </SongProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
