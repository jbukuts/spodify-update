import { useEffect, useState } from "react";

const LyricsScreen = ({ lyricsBody }) => {
  const [lyrics, setLyrics] = useState([]);

  useEffect(() => {
    setLyrics(() => {
      return lyricsBody
        .split("\n")
        .filter((x) => x !== "")
        .slice(0, -2);
    });
  }, []);

  return (
    <div style={{ paddingLeft: "3px", paddingRight: "3px" }}>
      {lyrics.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      <p className="thanks" style={{ textAlign: "right", fontSize: "10px" }}>
        Lyrics from MusixMatch
      </p>
    </div>
  );
};

export default LyricsScreen;
