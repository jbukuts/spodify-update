import "./AboutScreen.css";
import MainScreen from "../MainScreen/MainScreen";

const AboutScreen = ({ userData, songAmount, artistAmount, albumAmount }) => {

  const {display_name, product, explicit_content: { filter_enabled } } = userData;

  return (
    <MainScreen>
      <p className="aboutTitle">{display_name}'s iPod</p>

      <p className="justified">ALBUM{albumAmount > 1 ? 'S' : ''} {albumAmount}</p>
      <p className="justified">ARTIST{artistAmount > 1 ? 'S' : ''} {artistAmount}</p>
      <p className="justified">SONG{songAmount > 1 ? 'S' : ''} {songAmount}</p>
      <p className="justified">{`EXPLICIT ${!filter_enabled ? 'ALLOW' : 'DENY'}`}</p>
      <p className="justified">{`PRODUCT ${product.toUpperCase()}`}</p>
    </MainScreen>
  );
};

export default AboutScreen;
