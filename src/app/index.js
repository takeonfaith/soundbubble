import './index.css';
import React from 'react'
import { HashRouter } from 'react-router-dom';
import { AppRouter } from './routers/app-router';

export default function App() {
  return (
    <HashRouter basename="/">
      <AppRouter />
    </HashRouter>
  );
}
