import { useEffect, useState } from "react";
import { getProfileData, getPlayBackState, setUsersRepeatMode, toggleShuffleMode } from '../../common/client-api-calls';
import AboutScreen from "../AboutScreen/AboutScreen";

const SettingsScreen = ({addNewScreen, token, showClock, setShowClock, screenEffect, setScreenEffect}) => {

    const [userData, setUserData] = useState();
    const [repeatMode, setRepeatMode] = useState();
    const [shuffleMode, setShuffleMode] = useState();
    const [clock, setClock] = useState(showClock);
    const [screenEff, setScreenEff] = useState(screenEffect);

    const repeatModes = {
        off: 'None',
        context: 'All',
        track: 'Song'
    }

    const incRepeatMode = () => {
        const currentIndex = Object.keys(repeatModes).findIndex(v => v === repeatMode);
        const newIndex = currentIndex === 2 ? 0 : currentIndex + 1;
        const mode = Object.keys(repeatModes)[newIndex];
        setUsersRepeatMode(token, mode).then(r => {
            if (r.ok) setRepeatMode(mode);
        });
    }

    const toggleShuffleState = () => {
        const mode = !shuffleMode;
        toggleShuffleMode(token, mode).then(r => {
            if (r.ok) setShuffleMode(mode);
        });
    }

    const toggleShowClock = () => {
        setShowClock((old) => {
            setClock(!old)
            return !old;
        });
    }

    const toggleScreenEffect = () => {
        setScreenEffect((old) => {
            setScreenEff(!old)
            return !old;
        });
    }

    useEffect(() => {
        getProfileData(token).then(r => {
            console.log(r);
            setUserData(r);
        });

        getPlayBackState(token).then(r => {
            const {shuffle_state, repeat_state} = r;
            setRepeatMode(repeat_state);
            setShuffleMode(shuffle_state);
        });
    }, []);

    return (<>
        <p className='menuItem' onClick={(e) => addNewScreen(e, <AboutScreen userData={userData}/>)}>About</p>
        <p className='menuItem justified' onClick={incRepeatMode}>Repeat {repeatModes[repeatMode]}</p>
        <p className='menuItem justified' onClick={toggleShuffleState}>Shuffle {shuffleMode ? 'On': 'Off'}</p>
        <p className='menuItem justified' onClick={toggleShowClock}>Clock {clock ? 'True' : 'False'}</p>
        <p className='menuItem justified' onClick={toggleScreenEffect}>CRT {screenEff ? 'On' : 'Off'}</p>
    </>);
}

export default SettingsScreen;