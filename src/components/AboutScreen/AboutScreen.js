import "./AboutScreen.css";
import { useEffect, useState } from "react";
import MainScreen from "../MainScreen/MainScreen";

const AboutScreen = ({ userData }) => {
  const [displayName, setDisplayName] = useState();

  useEffect(() => {
    const { display_name } = userData;
    setDisplayName(display_name);
  }, [userData]);

  return (
    <MainScreen>
      <p className="aboutTitle">{displayName}'s iPod</p>
    </MainScreen>
  );
};

export default AboutScreen;
