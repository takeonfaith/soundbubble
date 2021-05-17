import '../../App.css';
import React, { useState, useRef, useEffect } from 'react'
import { songs } from '../../data/songs'
import { BiChevronLeft } from 'react-icons/bi'
import { rightSide } from '../../data/playerRightSide'
import { Player } from '../FullScreenPlayer/Player';
import { HiChevronDown } from 'react-icons/hi';
import { useSong } from '../../functionality/SongPlay/SongContext';

export default function FullScreenPlayer() {
  const {
    imgColors, 
    currentSong, 
    inputRef, 
    rightSideCurrentPage, 
    setRightSideCurrentPage,
    openFullScreenPlayer,
    setOpenFullScreenPlayer,
    name, 
    lyrics
  } = useSong()
  const [openMenu, setOpenMenu] = useState(false)
  const lyricsRef = useRef(null)
  

  useEffect(() => {
    if(imgColors.length !== 0){
      document.documentElement.style.setProperty('--themeColor', imgColors[1]);
      document.documentElement.style.setProperty('--themeColor2', imgColors[0]);
      document.documentElement.style.setProperty('--themeColor3', imgColors[2]);
      document.documentElement.style.setProperty('--themeColor4', imgColors[5]);
      document.documentElement.style.setProperty('--themeColorTransparent', imgColors[0] + '6e');
    }
  }, [imgColors])


  function rightSideContent(currentPage) {
    let RightSidePage = rightSide[currentPage].component
    return (<RightSidePage/>)
  }

  function noLyrics(){
    return lyrics.length === 0
  }

  function changeRightSidePage(el){
    if(el.id === 2 && noLyrics()) return null

    setRightSideCurrentPage(el.id); 
    setOpenMenu(true) 
  }
  return (
    <div className="bg" style = {openFullScreenPlayer?{top:0, opacity:1, visibility:'visible', zIndex:10}:{}}>
      <div className = "closeFullScreen" onClick={()=>{setOpenFullScreenPlayer(false)}}>
        <HiChevronDown/>
      </div>
      <div className="FullScreenPlayer">

        <div className="leftSide" style={!openMenu ? { width: '100%' } : {}}>
          <Player inputRef = {inputRef}/>
        </div>
        <div className="rightSideWrapper" style={!openMenu ? { transform: 'translateX(calc(100% - 90px))', width: 0 } : {}}>
          <button className="menuBtn" style={openMenu ? { transform: 'rotate(180deg)' } : { opacity: 0, visibility: 'hidden' }} onClick={() => setOpenMenu(!openMenu)}><BiChevronLeft /></button>
          <div className="rightSideControl">
            {rightSide.map((el, i) => {
              return (
                <div className="controlIcon" key={el.id} style={el.id === rightSideCurrentPage && openMenu ? { background: "var(--themeColor)" } :el.id === 2 && noLyrics()?{opacity:.4}:{}} onClick={()=>changeRightSidePage(el)}>
                  {el.icon}
                </div>
              )
            })}
          </div>
          <div className="rightSide" ref={lyricsRef} style={!openMenu ? { display: 'none' } : {}}>
            {rightSideContent(rightSideCurrentPage)}
          </div>
        </div>

      </div>
    </div>
  );
}