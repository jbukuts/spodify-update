import "./AboutScreen.css";
import { useEffect, useState } from "react";

const AboutScreen = ({ userData }) => {
  const [displayName, setDisplayName] = useState();

  useEffect(() => {
    const { display_name } = userData;
    setDisplayName(display_name);
  }, [userData]);

  return (
    <>
      <p className="aboutTitle">{displayName}'s iPod</p>
    </>
  );
};

export default AboutScreen;
