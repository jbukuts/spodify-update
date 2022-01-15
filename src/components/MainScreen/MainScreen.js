import React, { useEffect, useRef, useState } from "react";
import "./MainScreen.css";

const MainScreen = ({ children, showSearchBar, toggleKeyControls }) => {
  const [childrenList, setChildrenList] = useState(children);
  const [toShow, setToShow] = useState(20);

  const searchRef = useRef();
  const scrollRef = useRef();

  const filterSearch = (e) => {
    const {
      target: { value },
    } = e;
    if (!value) {
      setChildrenList(children);
      return;
    }
    const regex = new RegExp(`${value}*`, "i");
    const filtered = childrenList.filter((c) => regex.test(c.props.children));
    setChildrenList(filtered);
  };

  useEffect(() => {
    setChildrenList(children);
  }, [children]);

  useEffect(() => {
    const onScroll = (e) => {
      const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
      const leftToScroll = scrollHeight - (scrollTop + clientHeight);
      if (leftToScroll < 200) setToShow((old) => old + 20);
    };

    scrollRef.current.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="menuScreen" ref={scrollRef}>
      {showSearchBar && (
        <input
          type="text"
          placeholder="Search..."
          ref={searchRef}
          onChange={filterSearch}
          onFocus={() => toggleKeyControls(false)}
          onBlur={() => toggleKeyControls(true)}
        ></input>
      )}
      {!showSearchBar ? childrenList : childrenList.slice(0, toShow)}
    </div>
  );
};

export default MainScreen;
