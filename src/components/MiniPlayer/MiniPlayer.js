import { useEffect, useRef, useState } from "react";
import "./MiniPlayer.css";

const MiniPlayer = ({ imageURL, setShowScreen, playerState }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [songName, setSongName] = useState();
  const [artistName, setArtistName] = useState();
  const [albumName, setAlbumName] = useState();
  const playerRef = useRef();

  useEffect(() => {
    new Promise((r) => setTimeout(r, 500)).then(() => {
      playerRef.current.style.zIndex = isShowing ? "2" : "1";
      setShowScreen(!isShowing);
    });
  }, [isShowing, setShowScreen]);

  useEffect(() => {
    if (playerState) {
      const { track_window: { current_track: { name: songTitle, artists, album : { name: albumTitle} }}} = playerState;
      setSongName(songTitle);
      setAlbumName(albumTitle);
      setArtistName(artists[0].name);
    }
  }, [playerState]);

  return (
    <div className="wrapper" ref={playerRef}>
      <div className={`miniPlayer${isShowing ? " showing" : " showingBack"}`}>
        <img
          alt="Album Art"
          className={`albumArt`}
          src={imageURL}
          onClick={() => setIsShowing(!isShowing)}
        />
        <div className={`info${isShowing ? ' show' : ''}`}>
          <p>{songName}</p>
          <p>{artistName}</p>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
