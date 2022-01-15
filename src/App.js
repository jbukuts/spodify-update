import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import MainScreen from './components/MainScreen/MainScreen';
import NowPlaying from './components/NowPlaying/NowPlaying';
import MenuBar from './components/MenuBar/MenuBar';
import Login from './components/Login/Login';
import { getUsersAlbumsSpotify, playSongByURIList, getProfileData } from './common/client-api-calls';
import { getRandomInt } from './common/helper';
import createPlayer from  './common/player';
import Blobs from './components/Blobs/Blobs';
import SongList from './components/SongList/SongList';
import SettingsScreen from './components/SettingsScreen/SettingsScreen';
import MiniPlayer from './components/MiniPlayer/MiniPlayer';
import ArtistScreen from './components/ArtistScreen/ArtistScreen';
import SearchScreen from './components/SearchScreen/SearchScreen';

const App = () => {

  const [screens, setScreenState] = useState([]);
  const [token, setToken] = useState();
  const [player, setPlayer] = useState();
  const [menuTitle, setMenuTitle] = useState(['Menu']);
  const [albumArt, setAlbumArt] = useState();
  const [playerState, setPlayerState] = useState(null);
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [keyEventsOn, setKeyEventsOn] = useState(true);

  // song data
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  // local states
  const [showClock, setShowClock] = useState(false);
  const [crtMode, setCrtMode] = useState(false);
  const [showScreen, setShowScreen] = useState(true);

  const screenRef = useRef();
  const mainRef = useRef();

  const goBack = useCallback((amount = 1) => {
    if (menuTitle.length > 1) {
      console.log('going back!')
      setMenuTitle(oldMenus => oldMenus.slice(amount));
      screenRef.current.style.left = `calc(-${screens.length-amount}00%)`;
      new Promise(r => setTimeout(r, 250)).then(() => {
        setScreenState((oldScreens) => oldScreens.slice(0,-amount));
      });
    }
  }, [menuTitle, screens]);

  const addNewScreen = useCallback((e, screenToAdd, addSearchBar = false) => {
    const newTitle = e.target.innerText;
    setMenuTitle((oldTitles) => {
      const isNowPlaying = oldTitles.findIndex((t) => t === 'Now Playing');
      if (newTitle === 'Now Playing' && isNowPlaying > -1) {
          return oldTitles.slice(isNowPlaying);
      }
      return [newTitle, ...oldTitles]
    });

    setScreenState((oldScreens) => {
      const isNowPlaying = oldScreens.findIndex((t) => t.screen.type === NowPlaying);
      console.log(screenToAdd.type === NowPlaying, isNowPlaying);
      if (screenToAdd.type === NowPlaying && isNowPlaying > -1) {
        return oldScreens.slice(0, isNowPlaying+1);
      }
      return [...oldScreens, {screen: screenToAdd, searchBar: addSearchBar}];
    });
  }, []);

  const createArtistCallback = (artist) => {
    console.log(artist);
    const filteredAlbums = albums.filter(a => a.artists[0].id === artist.id);
    return <ArtistScreen 
      token={token} 
      artist={artist}
      addNewScreen={addNewScreen} 
      player={player}
      yourAlbums={filteredAlbums}/>;
  };

  const createFullAlbumList = () => {
    return albums.map((a,i) => {
      const {name} = a;
      return <p key={i} className="menuItem isMenu" onClick={() => addNewScreen({target: {innerText: name}}, <SongList album={a} player={player} token={token}/>)}>{name}</p>
    });
  };

  const createFullArtistList = () => {
    const allArtists = albums
      .map(a => a.artists[0])
      .filter((a, i, self )=> {
        return i === self.findIndex((t) => t.id === a.id)
      })
      .sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    console.log(allArtists);

    return allArtists.map((a, idx) => 
      <p className="menuItem isMenu" key={idx} onClick={(e) => addNewScreen(e,createArtistCallback(a))}>{a.name}</p>
    );
  };

  const createFullSongList = () => {
    const playSongs = (i) => {
      console.log(i);
      const amount = 2;
      const start = i-amount < 0 ? 0 : i-amount;
      const songsToPlay = songs
        .slice(start, i+amount+1)
        .map(s => s.uri);
      console.log(songsToPlay);
      playSongByURIList(token, songsToPlay, (i-amount) < 0 ? 0 : amount);
    }

    return songs.map((s,i) => {
      const { name } = s;
      return <p key={i} className='menuItem' onClick={() => playSongs(i)}>{name}</p> 
    });
  }

  const createMusicScreen = () => {
    return (<>
      <p className="menuItem isMenu" onClick={(e) => addNewScreen(e, createFullAlbumList, true)}>Albums</p>
      <p className="menuItem isMenu" onClick={(e) => addNewScreen(e, createFullArtistList, true)}>Artists</p>
      <p className="menuItem isMenu" onClick={(e) => addNewScreen(e, createFullSongList, true)}>Songs</p>
      <p className="menuItem isMenu" onClick={(e) => addNewScreen(e, <SearchScreen token={token} player={player} addNewScreen={addNewScreen}/>)}>Search</p>
    </>);
  };

  const toggleKeyControls = (val) => {
    setKeyEventsOn(val);
  };

  const shuffleSongs = () => {
    const songIndices = [];
    for (var i = 0; i < 10; i++) {
      const index = getRandomInt(0, songs.length);
      if (songIndices.includes(index)) {
        i--;
        continue;
      }
      songIndices.push(index);
    }
    
    const shuffledSongs = songIndices.map(s => songs[s].uri);
    playSongByURIList(token, shuffledSongs);
  }

  // shift on screen update
  useEffect(()=> {
    screenRef.current.style.left = `calc(-${screens.length}00%)`;
  }, [screens]);

  // after the token build the player
  useEffect(() => {
    if (token) {
      createPlayer(token).then(p => {
        setPlayer(p);
      })
    }
  }, [token]);

  // after play get the albums
  useEffect(() => {
    const playerStateChange = (state) => {
      const { track_window: {current_track: { album: { images }}}} = state;
      setPlayerState(state);
      setAlbumArt(images[0].url);
    }

    if (player) {
      player.addListener('player_state_changed', playerStateChange);

      // get the album data
      getUsersAlbumsSpotify(token).then(allAlbums => {
        setAlbums(allAlbums);
        const allSongs = allAlbums
          .reduce((acc, curr) => [...acc, ...curr.tracks.items], [])
          .sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        setSongs(allSongs);
        console.log('loaded albums');
        setFullyLoaded(true);
      });
    }
  }, [player, token]);

  // create listeners for key events
  useEffect(() => {
    const createKeyListeners = (e) => {
      // create volume events
      if (keyEventsOn) {
        if (e.code === "ArrowUp" || e.code === "ArrowDown") {
          let volumeChange = 0;
          if (e.code === "ArrowUp") volumeChange = .05;
          else if (e.code === "ArrowDown") volumeChange = -.05;
  
          player.getVolume().then(currentVolume => {
              const newVolume = Math.min(Math.max(currentVolume + volumeChange, 0), 1);
              player.setVolume(newVolume);
          });
        }
        else if (e.code === 'ArrowLeft') {
            player.previousTrack();
        }
        else if (e.code === 'ArrowRight') {
            player.nextTrack();
        }
        else if(e.code === 'Space') {
            player.togglePlay();
        }
        else if(e.code === 'Escape') {
          console.log('go to main');
          goBack(screens.length);
        }
      }
    };

    if (player) {
      if (keyEventsOn) document.addEventListener('keyup', createKeyListeners);
      else document.removeEventListener('keyup', createKeyListeners);
    }

    return () => document.removeEventListener('keyup', createKeyListeners);
  }, [keyEventsOn, player, menuTitle, screens]);

  useEffect(()=> {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

        window.location.hash = "";
        window.localStorage.setItem("token", token);
        setToken(token);
    }
    else if (token) {
      getProfileData(token).then(r => {
        if (r.error && r.error.status === 401) {
          localStorage.removeItem('token');
          window.location.reload();
        }
        else {
          setToken(token);
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <div className={`screen${crtMode ? ' crtEffect' : ''}`} ref={mainRef} style={{ opacity: showScreen ? '1' : '0'}}>
        { fullyLoaded && <MenuBar goBack={goBack} title={menuTitle[0]} showClock={showClock}/>}
          <div className='menuContainer' ref={screenRef}>
          <MainScreen>
            {!token && <Login></Login>}
            {fullyLoaded && <>
              <p className="menuItem isMenu" onClick={(e) => addNewScreen(e, createMusicScreen)}>Music</p>
              <p className="disabled">Extras</p>
              <p className="menuItem isMenu" onClick={(e) => addNewScreen(e, <SettingsScreen 
                token={token} 
                addNewScreen={addNewScreen}
                showClock={showClock}
                setShowClock={setShowClock}
                screenEffect={crtMode}
                setScreenEffect={setCrtMode}/>)}>Settings</p>
              <p className="menuItem" onClick={shuffleSongs}>Shuffle Songs</p>
              <p className="menuItem isMenu" onClick={(e) => addNewScreen(e,<NowPlaying
                player={player} 
                addScreen={addNewScreen} 
                token={token}
                createArtistScreen={createArtistCallback}/>)}>Now Playing</p>
            </>}
          </MainScreen>
          {fullyLoaded && screens.map(({screen, searchBar}, idx) => {
            return (
              <MainScreen key={idx} showSearchBar={searchBar} toggleKeyControls={toggleKeyControls}>
                {screen}
              </MainScreen>
            )
          })}
        </div>
      </div>
      {albumArt && <MiniPlayer imageURL={albumArt} setShowScreen={setShowScreen}/>}
      {albumArt && <Blobs imageURL={albumArt}></Blobs>}
    </div>
  )
}

export default App;
