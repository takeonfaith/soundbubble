import './App.css';
import React from 'react'
import FullScreenPlayer from './components/Basic/FullScreenPlayer';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/Basic/AppRouter';
import { LeftsideBar } from './components/Basic/LeftsideBar';
import { useSong } from './functionality/SongPlay/SongContext';
import { songs } from './data/songs';
export default function App() {
  const { songRef, loadSongData, playing, currentSong, currentSongLocal, songSrc } = useSong()

  return (
    <BrowserRouter>
      <audio src={songSrc} ref={songRef} onLoadedData={loadSongData} onTimeUpdate={playing} ></audio>
      <div style={{ display: 'flex', minWidth: '100%', background: 'var(--navItemColor' }} className = "Wrapper">
        <LeftsideBar />
        <div className = "Content">
          <AppRouter />
        </div>
      </div>
      <FullScreenPlayer />
    </BrowserRouter>
  );
}
