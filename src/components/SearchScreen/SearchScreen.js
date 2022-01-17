import "./SearchScreen.css";
import { useRef, useState } from "react";
import {
  getMultipleAlbums,
  performSearch,
} from "../../common/client-api-calls";
import SongList from "../SongList/SongList";

const SearchScreen = ({ token, addNewScreen, player }) => {
  const [results, setResults] = useState(<></>);

  const formRef = useRef(null);

  const onSearch = () => {
    const form = formRef.current;
    console.log(form.value);
    performSearch(token, form.value).then((r) => {
      const {
        albums: { items },
      } = r;

      getMultipleAlbums(
        token,
        items.map((a) => a.id)
      ).then((r) => {
        const { albums } = r;
        const results = albums.map((a, i) => (
          <p
            key={i}
            className="menuItem isMenu"
            onClick={() =>
              addNewScreen(
                { target: { innerText: a.name } },
                <SongList album={a} player={player} token={token} />
              )
            }
          >
            {a.name}
          </p>
        ));

        setResults(results);
      });
    });
  };

  return (
    <>
      <div className="searchBar">
        <div className="inputWrapper">
          <input ref={formRef} placeholder="Enter your search..."></input>
        </div>
        <button onClick={onSearch}>Go</button>
      </div>
      {results}
    </>
  );
};

export default SearchScreen;
