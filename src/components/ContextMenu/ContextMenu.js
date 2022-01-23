import { useEffect } from "react";
import "./ContextMenu.css";

const ContextMenu = ({ xPos, yPos, showMenu, innerMenu, setShowMenu }) => {

  useEffect(() => {
    const handleClick = (e) => {
      // if (e.target.className !== 'contextItem')
      setShowMenu(false);
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [setShowMenu])


  return <>{showMenu && <div onBlur={() => setShowMenu(false)} style={{left: xPos, top: yPos}}className="contextMenu">{innerMenu}</div>}</>;
};

export default ContextMenu;
