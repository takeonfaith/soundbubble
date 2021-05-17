import './App.css';
import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routers/AppRouter';
export default function App() {
  

  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  );
}
