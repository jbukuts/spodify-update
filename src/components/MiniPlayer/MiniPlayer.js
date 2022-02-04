import { useEffect, useRef, useState } from "react";
import "./MiniPlayer.css";

const MiniPlayer = ({ imageURL, setShowScreen, playerState }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [songName, setSongName] = useState();
  const [artistName, setArtistName] = useState();
  const [showClass, setShowClass] = useState("");
  const playerRef = useRef();

  useEffect(() => {
    new Promise((r) => setTimeout(r, 500)).then(() => {
      playerRef.current.style.zIndex = isShowing ? "2" : "1";
      setShowScreen(!isShowing);
    });
  }, [isShowing, setShowScreen]);

  useEffect(() => {
    setShowClass(isShowing ? "showing" : "showingBack");
  }, [isShowing]);

  useEffect(() => {
    if (playerState) {
      const {
        track_window: {
          current_track: { name: songTitle, artists },
        },
      } = playerState;
      setSongName(songTitle);
      setArtistName(artists[0].name);
    }
  }, [playerState]);

  const imgRef = useRef();

  useEffect(() => {
    imgRef.current.style.backgroundImage = `url(${imageURL})`;
  }, [imageURL]);

  return (
    <div className="wrapper" ref={playerRef}>
      <div
        className={`miniPlayer ${showClass}`}
        onAnimationEnd={() => setShowClass("")}
      >
        <div
          className={`cdCover${isShowing ? " showing" : ""}`}
          onClick={() => setIsShowing(!isShowing)}
        >
          <div
            ref={imgRef}
            className={`albumArt`}
            style={{ borderRadius: !isShowing ? "0px" : "0px" }}
          />
          <div className="backCover" />
        </div>

        <div className={`info${isShowing ? " show" : ""}`}>
          <p>{songName}</p>
          <p>{artistName}</p>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
