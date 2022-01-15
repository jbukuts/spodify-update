import "./ArtistScreen.css";
import { useEffect, useState } from "react";
import SongList from "../SongList/SongList";
import {
  getArtistAlbumsById,
  getMultipleAlbums,
} from "../../common/client-api-calls";

const ArtistScreen = ({ artist, yourAlbums, player, addNewScreen, token }) => {
  const [otherAlbums, setOtherAlbums] = useState([]);

  useEffect(async () => {
    getArtistAlbumsById(token, artist.id).then((albums) => {
      const { items: otherAlbums } = albums;
      const albumsOfInterest = otherAlbums
        .map((x) => x.id)
        .filter((a) => yourAlbums.map((b) => b.id).indexOf(a) < 0);

      getMultipleAlbums(token, albumsOfInterest).then((r) => {
        const { albums } = r;
        if (albums) setOtherAlbums(albums);
      });
    });
  }, []);

  return (
    <>
      <p className="subHeader">IN YOUR LIBRARY</p>
      {yourAlbums.map((a, idx) => (
        <p
          className="menuItem isMenu"
          key={idx}
          onClick={(e) =>
            addNewScreen(
              e,
              <SongList album={a} player={player} token={token} />
            )
          }
        >
          {a.name}
        </p>
      ))}
      <p className="subHeader" style={{ marginTop: "25px" }}>
        OTHER ALBUMS
      </p>
      {otherAlbums.map((a, idx) => (
        <p
          className="menuItem isMenu"
          key={idx}
          onClick={(e) =>
            addNewScreen(
              e,
              <SongList album={a} player={player} token={token} />
            )
          }
        >
          {a.name}
        </p>
      ))}
    </>
  );
};

export default ArtistScreen;
