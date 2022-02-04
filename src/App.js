import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import MainScreen from "./components/MainScreen/MainScreen";
import NowPlaying from "./components/NowPlaying/NowPlaying";
import MenuBar from "./components/MenuBar/MenuBar";
import Login from "./components/Login/Login";
import {
  getUsersAlbumsSpotify,
  playSongByURIList,
  getProfileData,
  removeAlbumFromLibrary,
  saveAlbumToLibrary,
} from "./common/client-api-calls";
import { getRandomInt } from "./common/helper";
import createPlayer from "./common/player";
import Blobs from "./components/Blobs/Blobs";
import SongList from "./components/SongList/SongList";
import SettingsScreen from "./components/SettingsScreen/SettingsScreen";
import MiniPlayer from "./components/MiniPlayer/MiniPlayer";
import ArtistScreen from "./components/ArtistScreen/ArtistScreen";
import SearchScreen from "./components/SearchScreen/SearchScreen";
import ContextMenu from "./components/ContextMenu/ContextMenu";
import ControlsModal from "./components/ControlsModal/ControlsModal";

const App = () => {
  const [screens, setScreenState] = useState([]);
  const [token, setToken] = useState();
  const [player, setPlayer] = useState();
  const [playState, setPlayState] = useState();
  const [menuTitle, setMenuTitle] = useState(["Menu"]);
  const [albumArt, setAlbumArt] = useState();
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [keyEventsOn, setKeyEventsOn] = useState(true);

  // song data
  const albums = useRef([]);
  const [songs, setSongs] = useState([]);

  // local states
  const [showClock, setShowClock] = useState(false);
  const [crtMode, setCrtMode] = useState(false);
  const [showScreen, setShowScreen] = useState(true);

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState(<></>);
  const [menuXPos, setMenuXPos] = useState(0);
  const [menuYPos, setMenuYPos] = useState(0);

  const [showControls, setShowControls] = useState(false);

  const [accentColor, setAccentColor] = useState("#000");

  const screenRef = useRef();
  const mainRef = useRef();

  const goBack = useCallback(
    (amount = 1) => {
      if (menuTitle.length > 1) {
        console.log("going back!");
        setMenuTitle((oldMenus) => oldMenus.slice(amount));
        screenRef.current.style.left = `calc(-${screens.length - amount}00%)`;
        new Promise((r) => setTimeout(r, 250)).then(() => {
          setScreenState((oldScreens) => oldScreens.slice(0, -amount));
        });
      }
    },
    [menuTitle, screens]
  );

  const addNewScreen = useCallback((e, screenToAdd) => {
    const newTitle = e.target.innerText;
    setMenuTitle((oldTitles) => {
      const isNowPlaying = oldTitles.findIndex((t) => t === "Now Playing");
      if (newTitle === "Now Playing" && isNowPlaying > -1) {
        return oldTitles.slice(isNowPlaying);
      }
      return [newTitle, ...oldTitles];
    });

    setScreenState((oldScreens) => {
      return [...oldScreens, screenToAdd];
    });
  }, []);

  const handleContextMenu = (innerMenu, x, y) => {
    setShowContextMenu(true);
    setContextMenu(innerMenu);
    setMenuXPos(x);
    setMenuYPos(y);
  };

  const removeAlbum = (album) => {
    removeAlbumFromLibrary(token, album.id).then((r) => {
      const albumToRemove = albums.current.findIndex((a) => a.id === album.id);

      // setAlbums(old => old.slice(0,albumToRemove).concat(old.slice(albumToRemove+1)));
      albums.current = albums.current
        .slice(0, albumToRemove)
        .concat(albums.current.slice(albumToRemove + 1));
    });
  };

  const addAlbum = (album) => {
    saveAlbumToLibrary(token, album.id).then((r) => {
      albums.current = [...albums.current, album].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      //setAlbums(old => [...old, album].sort((a, b) => a.name.localeCompare(b.name)));
    });
  };

  const createArtistCallback = (artist) => {
    const filteredAlbums = albums.current.filter(
      (a) => a.artists[0].id === artist.id
    );
    return (
      <ArtistScreen
        addAlbum={addAlbum}
        removeAlbum={removeAlbum}
        handleContextMenu={handleContextMenu}
        token={token}
        artist={artist}
        addNewScreen={addNewScreen}
        player={player}
        propAlbums={filteredAlbums}
      />
    );
  };

  const createFullAlbumList = () => {
    return (
      <MainScreen showSearchBar toggleKeyControls={toggleKeyControls}>
        {albums.current.map((a, i) => {
          const { name } = a;
          return (
            <p
              key={i}
              className="menuItem isMenu"
              onClick={() =>
                addNewScreen(
                  { target: { innerText: name } },
                  <SongList album={a} player={player} token={token} />
                )
              }
            >
              {name}
            </p>
          );
        })}
      </MainScreen>
    );
  };

  const createFullArtistList = () => {
    const allArtists = albums.current
      .map((a) => a.artists[0])
      .filter((a, i, self) => {
        return i === self.findIndex((t) => t.id === a.id);
      })
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    return (
      <MainScreen showSearchBar={true} toggleKeyControls={toggleKeyControls}>
        {allArtists.map((a, idx) => (
          <p
            className="menuItem isMenu"
            key={idx}
            onClick={(e) => addNewScreen(e, createArtistCallback(a))}
          >
            {a.name}
          </p>
        ))}
      </MainScreen>
    );
  };

  const createFullSongList = () => {
    const playSongs = (i) => {
      const amount = 2;
      const start = i - amount < 0 ? 0 : i - amount;
      const songsToPlay = songs.slice(start, i + amount + 1).map((s) => s.uri);
      playSongByURIList(token, songsToPlay, i - amount < 0 ? 0 : amount);
    };

    return (
      <MainScreen showSearchBar toggleKeyControls={toggleKeyControls}>
        {songs.map((s, i) => {
          const { name } = s;
          return (
            <p key={i} className="menuItem" onClick={() => playSongs(i)}>
              {name}
            </p>
          );
        })}
      </MainScreen>
    );
  };

  const createMusicScreen = () => {
    return (
      <MainScreen showSearchBar={false}>
        <p
          className="menuItem isMenu"
          onClick={(e) => addNewScreen(e, createFullAlbumList(), true)}
        >
          Albums
        </p>
        <p
          className="menuItem isMenu"
          onClick={(e) => addNewScreen(e, createFullArtistList(), true)}
        >
          Artists
        </p>
        <p
          className="menuItem isMenu"
          onClick={(e) => addNewScreen(e, createFullSongList(), true)}
        >
          Songs
        </p>
        <p
          className="menuItem isMenu"
          onClick={(e) =>
            addNewScreen(
              e,
              <SearchScreen
                handleContextMenu={handleContextMenu}
                toggleKeyControls={toggleKeyControls}
                token={token}
                player={player}
                addNewScreen={addNewScreen}
              />
            )
          }
        >
          Search
        </p>
      </MainScreen>
    );
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

    const shuffledSongs = songIndices.map((s) => songs[s].uri);
    playSongByURIList(token, shuffledSongs);
  };

  const logUserOut = () => {
    localStorage.clear();
    window.location.reload();
  }

  // shift on screen update
  useEffect(() => {
    screenRef.current.style.left = `calc(-${menuTitle.length - 1}00%)`;
  }, [menuTitle]);

  // after the token build the player
  useEffect(() => {
    if (token) {
      createPlayer(token).then((p) => {
        setPlayer(p);
      });
    }
  }, [token]);

  // after play get the albums
  useEffect(() => {
    const playerStateChange = (state) => {
      const {
        track_window: {
          current_track: {
            album: { images },
          },
        },
      } = state;
      setAlbumArt(images[0].url);
      setPlayState(state);
    };

    if (player) {
      player.addListener("player_state_changed", playerStateChange);

      // get the album data
      getUsersAlbumsSpotify(token).then((allAlbums) => {
        // setAlbums(allAlbums);
        albums.current = allAlbums;
        const allSongs = allAlbums
          .reduce((acc, curr) => [...acc, ...curr.tracks.items], [])
          .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          );
        setSongs(allSongs);
        console.log("loaded albums");
        setFullyLoaded(true);
      });
    }

    return () => player && player.disconnect();
  }, [player, token]);

  // create listeners for key events
  useEffect(() => {
    const createKeyListeners = (e) => {
      // create volume events
      if (keyEventsOn) {
        if (e.code === "ArrowUp" || e.code === "ArrowDown") {
          let volumeChange = 0;
          if (e.code === "ArrowUp") volumeChange = 0.05;
          else if (e.code === "ArrowDown") volumeChange = -0.05;

          player.getVolume().then((currentVolume) => {
            const newVolume = Math.min(
              Math.max(currentVolume + volumeChange, 0),
              1
            );
            player.setVolume(newVolume);
          });
        } else if (e.code === "ArrowLeft") {
          player.previousTrack();
        } else if (e.code === "ArrowRight") {
          player.nextTrack();
        } else if (e.code === "Space") {
          player.togglePlay();
        } else if (e.code === "Escape") {
          console.log("go to main");
          goBack(screens.length);
        }
      }
    };

    if (player) {
      if (keyEventsOn) document.addEventListener("keyup", createKeyListeners);
      else document.removeEventListener("keyup", createKeyListeners);
    }

    return () => document.removeEventListener("keyup", createKeyListeners);
  }, [keyEventsOn, player, menuTitle, screens, goBack]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
      setToken(token);
    } else if (token) {
      getProfileData(token).then((r) => {
        if (r.error && r.error.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
        } else {
          setToken(token);
        }
      });
    }

    const handleContext = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContext);
    return () => document.removeEventListener("contextmenu", handleContext);
  }, []);

  return (
    <div className="App">
      <div
        className={`screen${crtMode ? " crtEffect" : ""}`}
        ref={mainRef}
        style={{ opacity: showScreen ? "1" : "0" }}
      >
        {fullyLoaded && (
          <MenuBar goBack={goBack} title={menuTitle[0]} showClock={showClock} />
        )}
        <div className="menuContainer" ref={screenRef}>
          <MainScreen>
            {!token && <Login></Login>}
            {fullyLoaded && (
              <>
                <p
                  className="menuItem isMenu"
                  onClick={(e) => addNewScreen(e, createMusicScreen())}
                >
                  Music
                </p>
                <p className="disabled">Extras</p>
                <p
                  className="menuItem isMenu"
                  onClick={(e) =>
                    addNewScreen(
                      e,
                      <SettingsScreen
                        token={token}
                        addNewScreen={addNewScreen}
                        showClock={showClock}
                        setShowClock={setShowClock}
                        screenEffect={crtMode}
                        setScreenEffect={setCrtMode}
                        logout={logUserOut}
                        albumAmount={albums.current.length}
                      />
                    )
                  }
                >
                  Settings
                </p>
                <p className="menuItem" onClick={shuffleSongs}>
                  Shuffle Songs
                </p>
                <p
                  className="menuItem isMenu"
                  onClick={(e) =>
                    addNewScreen(
                      e,
                      <NowPlaying
                        player={player}
                        addScreen={addNewScreen}
                        token={token}
                        createArtistScreen={createArtistCallback}
                      />
                    )
                  }
                >
                  Now Playing
                </p>
              </>
            )}
          </MainScreen>
          {fullyLoaded && screens}
        </div>
      </div>
      {albumArt && (
        <MiniPlayer
          playerState={playState}
          imageURL={albumArt}
          setShowScreen={setShowScreen}
          accentColor={accentColor}
        />
      )}
      {showScreen && (
        <button
          style={{ color: accentColor, borderColor: accentColor }}
          className="controlButton"
          onClick={() => setShowControls((old) => !old)}
        >
          Controls
        </button>
      )}
      {showControls && (
        <ControlsModal
          isOpen={showControls}
          onClose={() => setShowControls(false)}
        ></ControlsModal>
      )}
      <Blobs imageURL={albumArt} setInverseColor={setAccentColor}></Blobs>
      {showContextMenu && (
        <ContextMenu
          setShowMenu={setShowContextMenu}
          showMenu={showContextMenu}
          innerMenu={contextMenu}
          xPos={menuXPos}
          yPos={menuYPos}
        />
      )}
    </div>
  );
};

export default App;
