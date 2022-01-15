import './AboutScreen.css';
import { useEffect } from "react";

const AboutScreen = ({userData}) => {

    const {display_name } = userData;

    useEffect(() => {
        console.log(userData);
    }, []);

    return (<>
        <p className='aboutTitle'>{display_name}'s iPod</p>
    </>);
}

export default AboutScreen;