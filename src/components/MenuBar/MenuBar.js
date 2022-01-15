import { useEffect, useRef, useState } from "react";
import "./MenuBar.css";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const options = { hour: "2-digit", minute: "2-digit" };

const MenuBar = ({ title, goBack, showClock }) => {
  const [menuText, setMenuText] = useState(title);

  useEffect(() => {
    setMenuText(title);
  }, [title]);

  useInterval(() => {
    if (showClock) {
      const time = new Date().toLocaleTimeString("en-US", options);
      setMenuText((oldMenu) => (oldMenu === title ? time : title));
    }
  }, 5000);

  return (
    <div className="menu" onClick={() => goBack()}>
      <p className="mainTitle">{menuText}</p>
    </div>
  );
};

export default MenuBar;
