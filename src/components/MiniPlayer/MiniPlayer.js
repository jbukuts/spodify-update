import { useEffect, useRef, useState } from "react";
import "./MiniPlayer.css";

const MiniPlayer = ({ imageURL, setShowScreen }) => {
  const [isShowing, setIsShowing] = useState(false);
  const playerRef = useRef();

  useEffect(() => {
    new Promise((r) => setTimeout(r, 500)).then(() => {
      playerRef.current.style.zIndex = isShowing ? "2" : "1";
      setShowScreen(!isShowing);
    });
  }, [isShowing]);

  return (
    <div className="miniPlayer" ref={playerRef}>
      <img
        className={`albumArt${isShowing ? " showing" : " showingBack"}`}
        src={imageURL}
        onClick={() => setIsShowing(!isShowing)}
      />
    </div>
  );
};

export default MiniPlayer;
