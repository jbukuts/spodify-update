import "./ArtistScreen.css";
import { useEffect, useState } from "react";
import SongList from "../SongList/SongList";
import {
  getArtistAlbumsById,
  getMultipleAlbums,
} from "../../common/client-api-calls";
import MainScreen from "../MainScreen/MainScreen";

const ArtistScreen = ({ artist, propAlbums, player, addNewScreen, token, handleContextMenu, removeAlbum, addAlbum }) => {
  const [otherAlbums, setOtherAlbums] = useState([]);
  const [yourAlbums, setYourAlbums] = useState(propAlbums);

  useEffect(() => {
    const { id } = artist;
    getArtistAlbumsById(token, id, 20).then((albums) => {
      const { items: otherAlbums } = albums;

      const albumsOfInterest = otherAlbums
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        )
        .filter((a) => yourAlbums.map((x) => x.id).indexOf(a.id) === -1)
        .filter((a) => yourAlbums.map((x) => x.name).indexOf(a.name) === -1)
        .map((x) => x.id);

      if (albumsOfInterest.length === 0) return;

      getMultipleAlbums(token, albumsOfInterest).then((r) => {
        const { albums } = r;
        if (albums) setOtherAlbums(albums);
      });
    });
  }, [token, artist, yourAlbums]);

  const removeContextMenu = (e, album, index) => {
    e.preventDefault();
    const xPos = e.pageX + "px";
    const yPos = e.pageY + "px";

    const removeTheAlbum = (album) => {
      //removeAlbum(album)
      setYourAlbums(old => {
        return old.slice(0,index).concat(old.slice(index+1));
      });
      removeAlbum(album);
    }

    handleContextMenu(<p className='contextItem' onClick={() => removeTheAlbum(album)}>Remove From Library</p>, xPos, yPos);
  };

  const addContextMenu = (e, album, index) => {
    e.preventDefault();
    const xPos = e.pageX + "px";
    const yPos = e.pageY + "px";

    const addTheAlbum = (album) => {
      console.log('splceuisf');
      setOtherAlbums(old => {
        return old.slice(0,index).concat(old.slice(index+1));
      });
      setYourAlbums(old => [...old, album]);
      addAlbum(album);
    }

    handleContextMenu(<p className='contextItem' onClick={() => addTheAlbum(album)}>Add to Library</p>, xPos, yPos);
  };

  return (
    <MainScreen>
      <p className="subHeader">IN YOUR LIBRARY</p>
      {yourAlbums.map((a, idx) => (
        <p
          onContextMenu={(e) => removeContextMenu(e, a, idx)}
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
      {otherAlbums && otherAlbums.length === 0 && (
        <p className="subHeader" style={{ opacity: 0.5 }}>
          YOU HAVE THEM ALL :)
        </p>
      )}
      {otherAlbums.map((a, idx) => (
        <p
          onContextMenu={(e) => addContextMenu(e, a, idx)}
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
    </MainScreen>
  );
};

export default ArtistScreen;
