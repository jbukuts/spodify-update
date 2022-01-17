import "./ArtistScreen.css";
import { useEffect, useRef, useState } from "react";
import SongList from "../SongList/SongList";
import {
  getArtistAlbumsById,
  getMultipleAlbums,
} from "../../common/client-api-calls";
import ContextMenu from "../ContextMenu/ContextMenu";

const ArtistScreen = ({ artist, yourAlbums, player, addNewScreen, token }) => {
  const [otherAlbums, setOtherAlbums] = useState([]);
  const screenRef = useRef();

  const [contextXPos, setContextXPos] = useState(0);
  const [contextYPos, setContextYPos] = useState(0);

  useEffect(() => {
    const { id } = artist;
    getArtistAlbumsById(token, id).then((albums) => {
      const { items: otherAlbums } = albums;
      console.log(otherAlbums);

      const albumsOfInterest = otherAlbums
        .filter((value, index, self) => index === self.findIndex((t) => t.name === value.name))
        .filter((a) => yourAlbums.map(x => x.id).indexOf(a.id) === -1)
        .filter((a) => yourAlbums.map(x => x.name).indexOf(a.name) === -1)
        .map((x) => x.id);

      console.log(yourAlbums);
      console.log(albumsOfInterest);

      if (albumsOfInterest.length === 0)
        return;

      getMultipleAlbums(token, albumsOfInterest).then((r) => {
        const { albums } = r;
        if (albums) setOtherAlbums(albums);
      });
    });
  }, [token, artist, yourAlbums]);

  const contextMenu = (e) => {
    e.preventDefault();
    const xPos = e.pageX + "px";
    const yPos = e.pageY + "px";
    console.log(e);

    setContextXPos(xPos);
    setContextYPos(yPos);

    console.log(xPos, yPos);
  }

  return (
    <>
      <p className="subHeader">IN YOUR LIBRARY</p>
      {yourAlbums.map((a, idx) => (
        <p
          onContextMenu={contextMenu}
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
      {otherAlbums && otherAlbums.length === 0 && <p className="subHeader" style={{opacity: .5}}>YOU HAVE THEM ALL :)</p>}
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
      <ContextMenu xPos={contextXPos} yPos={contextYPos} showMenu={true} innerMenu={<>Add Album to Libray</>}/>
    </>
  );
};

export default ArtistScreen;
