import { useContext, useEffect, useState } from "react";
import { playSongByAlbumURI } from "../../common/client-api-calls";
import PlayerContext from "../../PlayerContext";
import MainScreen from "../MainScreen/MainScreen";

const SongList = ({ album, token }) => {
  const [isThere, setIsThere] = useState(-1);
  const [items, setItems] = useState();
  const [albumURI, setAlbumURI] = useState();
  const [player] = useContext(PlayerContext);

  const playSongFromAlbum = (trackNumber, albumURI, id) => {
    playSongByAlbumURI(token, albumURI, trackNumber);
  };

  useEffect(() => {
    const {
      tracks: { items },
      uri,
    } = album;

    setItems(items);
    setAlbumURI(uri);

    const checkForNowPlaying = (state) => {
      const {
        track_window: {
          current_track: { id, linked_from },
        },
      } = state;

      if (linked_from.id) {
        const { id: linkedId } = linked_from;
        const isThere = items.findIndex((t) => t.id === linkedId);
        setIsThere(isThere);
        return;
      }

      const isThere = items.findIndex((t) => t.id === id);
      setIsThere(isThere);
    };

    player.getCurrentState().then((state) => {
      checkForNowPlaying(state);
    });

    player.addListener("player_state_changed", checkForNowPlaying);

    return () =>
      player.removeListener("player_state_changed", checkForNowPlaying);
  }, [player, album]);

  return (
    <MainScreen>
      <div className="songList">
        {items &&
          items.map((song, idx) => {
            const { track_number, name, id } = song;
            const isPlaying = isThere === idx;
            return (
              <p
                data-id={id}
                className={`menuItem${isPlaying ? " playing" : ""}`}
                key={idx}
                onClick={() =>
                  playSongFromAlbum(track_number - 1, albumURI, id)
                }
              >
                {name}
              </p>
            );
          })}
      </div>
    </MainScreen>
  );
};

export default SongList;
