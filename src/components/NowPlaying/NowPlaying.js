import React, { useEffect, useRef, useState } from "react";
import "./NowPlaying.css";
import {
  getCurrentlyPlaying,
  getAlbumById,
  getSongLyrics,
} from "../../common/client-api-calls";
import SongList from "../SongList/SongList";
import LyricsScreen from "../LyricsScreen/LyricsScreen";

const NowPlaying = ({ player: p, addScreen, token, createArtistScreen }) => {
  const [trackName, setTrackName] = useState();
  const [albumName, setAlbumName] = useState();
  const [artistName, setartistName] = useState();
  const [player] = useState(p);
  const [elapsed, setElapsed] = useState(0);
  const [left, setLeft] = useState(1);
  const elapsedRef = useRef(elapsed);
  const leftRef = useRef(left);
  let mouseDown = useRef(false);

  const scrubRef = useRef();
  const scrubLengthRef = useRef();
  const scrubHandleRef = useRef();

  const goToAlbumClick = () => {
    getCurrentlyPlaying(token).then((r) => {
      const {
        item: {
          album: { href },
        },
      } = r;
      const albumId = href.substring(href.lastIndexOf("/") + 1);
      getAlbumById(token, albumId).then((a) => {
        const { name } = a;
        addScreen(
          { target: { innerText: name } },
          <SongList album={a} player={player} token={token} />
        );
      });
    });
  };

  const goToArtistClick = () => {
    getCurrentlyPlaying(token).then(async (r) => {
      const {
        item: { artists },
      } = r;
      console.log(r);
      const artistScreen = await createArtistScreen(artists[0]);
      addScreen({ target: { innerText: artistName.name } }, artistScreen);
    });
  };

  const goToLyricsClick = () => {
    getSongLyrics(trackName, artistName.name).then((r) => {
      const { ok, data } = r;
      if (ok) {
        addScreen(
          { target: { innerText: trackName } },
          <LyricsScreen lyricsBody={data.lyrics_body} />
        );
      }
    });
  };

  const secondsToMinutes = (ms) => {
    const seconds = ms / 1000;
    const minutes = ~~(seconds / 60);
    const leftOver = ~~(seconds % 60);
    return `${minutes}:${String(leftOver).padStart(2, "0")}`;
  };

  const scrubSong = (e) => {
    if (mouseDown.current) {
      var rect = scrubRef.current.getBoundingClientRect();
      var x = e.clientX - rect.left;
      const percent = x / scrubRef.current.offsetWidth;
      scrubLengthRef.current.style.width = `${Math.floor(percent * 100)}%`;
      scrubHandleRef.current.style.left = `${Math.floor(percent * 100)}%`;

      elapsedRef.current = (elapsedRef.current + leftRef.current) * percent;
      leftRef.current = (elapsedRef.current + leftRef.current) * (1 - percent);
      setElapsed(elapsedRef.current);
      setLeft(leftRef.current);
    }
  };

  useEffect(() => {
    player.getCurrentState().then((state) => handleStateChange(state));

    const handleStateChange = (state) => {
      if (mouseDown.current) return;
      const {
        duration,
        position,
        track_window: {
          current_track: {
            name: songName,
            album: { name: albumName },
            artists,
          },
        },
      } = state;

      const timeLeft = duration - position;
      setLeft(timeLeft);
      setElapsed(position);
      leftRef.current = timeLeft;
      elapsedRef.current = position;
      scrubHandleRef.current.style.left = `${
        (position / (position + timeLeft)) * 100
      }%`;
      scrubLengthRef.current.style.width = `${
        (position / (position + timeLeft)) * 100
      }%`;
      setAlbumName(albumName);
      setTrackName(songName);
      setartistName(artists[0]);
    };

    player.getCurrentState().then((state) => handleStateChange(state));
    player.addListener("player_state_changed", handleStateChange);

    const scrubInterval = setInterval(() => {
      player.getCurrentState().then((state) => handleStateChange(state));
    }, 1000);

    if (scrubRef) {
      const mouseUpScrub = (e) => {
        if (mouseDown.current) {
          player.getCurrentState().then(async (state) => {
            const { duration } = state;
            await player.seek(
              duration *
                (scrubLengthRef.current.offsetWidth /
                  scrubRef.current.offsetWidth)
            );
            await player.resume();
            mouseDown.current = false;
          });
        }
      };

      scrubRef.current.addEventListener("mousedown", (e) => {
        player.pause();
        mouseDown.current = true;
        scrubSong(e);
      });
      scrubRef.current.addEventListener("mouseup", (e) => mouseUpScrub(e));
      scrubRef.current.addEventListener("mouseleave", (e) => mouseUpScrub(e));
      scrubRef.current.addEventListener("mousemove", (e) => scrubSong(e));
    }

    return () => {
      player.removeListener("player_state_changed", handleStateChange);
      clearInterval(scrubInterval);
    };
  }, [player]);

  return (
    <div className="nowPlaying">
      <p onClick={goToLyricsClick}>{trackName}</p>
      <p onClick={goToAlbumClick}>{albumName}</p>
      <p onClick={goToArtistClick}>{artistName?.name}</p>
      <div className="scrubBar" ref={scrubRef}>
        <div className="scrubLength" ref={scrubLengthRef}>
          <div className="scrubHandle" ref={scrubHandleRef}></div>
        </div>
      </div>
      <div>
        <p className="playerTime">
          {secondsToMinutes(elapsed)} -{secondsToMinutes(left)}
        </p>
      </div>
    </div>
  );
};

export default NowPlaying;
