import { useEffect, useState } from "react";
import MainScreen from "../MainScreen/MainScreen";

const LyricsScreen = ({ lyricsBody }) => {
  const [lyrics, setLyrics] = useState([]);

  useEffect(() => {
    setLyrics(() => {
      return lyricsBody
        .split("\n")
        .filter((x) => x !== "")
        .slice(0, -2);
    });
  }, [lyricsBody]);

  return (
    <MainScreen>
      <div style={{ paddingLeft: "3px", paddingRight: "3px" }}>
        {lyrics.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        <p className="thanks" style={{ textAlign: "right", fontSize: "10px" }}>
          Lyrics from MusixMatch
        </p>
      </div>
    </MainScreen>
  );
};

export default LyricsScreen;
