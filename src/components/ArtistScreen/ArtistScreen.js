import "./ArtistScreen.css";
import { useEffect, useState } from "react";
import SongList from "../SongList/SongList";
import {
  getArtistAlbumsById,
  getMultipleAlbums,
} from "../../common/client-api-calls";
import MainScreen from "../MainScreen/MainScreen";

const ArtistScreen = ({
  artist,
  propAlbums,
  addNewScreen,
  token,
  handleContextMenu,
  removeAlbum,
  addAlbum,
}) => {
  const [otherAlbums, setOtherAlbums] = useState([]);
  const [otherSingles, setOtherSingles] = useState([]);
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
        console.log(r);
        const { albums } = r;
        if (albums) {
          const sorted = albums.sort((a, b) => a.name.localeCompare(b.name));
          setOtherAlbums(sorted.filter((a) => a["album_type"] === "album"));
          setOtherSingles(sorted.filter((a) => a["album_type"] === "single"));
        }
      });
    });
  }, [token, artist, yourAlbums]);

  const removeContextMenu = (e, album, index) => {
    e.preventDefault();
    const xPos = e.pageX + "px";
    const yPos = e.pageY + "px";

    const removeTheAlbum = (album) => {
      //removeAlbum(album)
      setYourAlbums((old) => {
        return old.slice(0, index).concat(old.slice(index + 1));
      });
      removeAlbum(album);
    };

    handleContextMenu(
      <p className="contextItem" onClick={() => removeTheAlbum(album)}>
        Remove From Library
      </p>,
      xPos,
      yPos
    );
  };

  const addContextMenu = (e, album, index) => {
    e.preventDefault();
    const xPos = e.pageX + "px";
    const yPos = e.pageY + "px";

    const addTheAlbum = (album) => {
      setOtherAlbums((old) => {
        return old.slice(0, index).concat(old.slice(index + 1));
      });
      setYourAlbums((old) =>
        [...old, album].sort((a, b) => a.name.localeCompare(b.name))
      );
      addAlbum(album);
    };

    handleContextMenu(
      <p className="contextItem" onClick={() => addTheAlbum(album)}>
        Add to Library
      </p>,
      xPos,
      yPos
    );
  };

  const OtherAlbumsList = ({ albums, handleContextMenu }) => {
    return (
      <>
        {albums.map((a, idx) => (
          <p
            onContextMenu={(e) => handleContextMenu(e, a, idx)}
            className="menuItem isMenu"
            key={idx}
            onClick={(e) =>
              addNewScreen(
                e,
                <SongList album={a} token={token} />
              )
            }
          >
            {a.name}
          </p>
        ))}
      </>
    );
  };

  return (
    <MainScreen>
      <p className="subHeader">IN YOUR LIBRARY</p>
      <OtherAlbumsList
        handleContextMenu={removeContextMenu}
        albums={yourAlbums}
      />
      {otherAlbums && otherAlbums.length > 0 && 
        <p className="subHeader">OTHER ALBUMS</p>
      }
      <OtherAlbumsList
        handleContextMenu={addContextMenu}
        albums={otherAlbums}
      />
      {otherSingles && otherSingles.length > 0 && 
        <p className="subHeader">OTHER SINGLES</p>
      }
      <OtherAlbumsList
        handleContextMenu={addContextMenu}
        albums={otherSingles}
      />
    </MainScreen>
  );
};

export default ArtistScreen;
