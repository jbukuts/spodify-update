import { useRef } from 'react';
import './ControlsModal.css';

const ControlsModal = ({isOpen, onClose}) => {

    const modalRef = useRef();

    const requestClose = () => {
        onClose();
    }

    return (<div ref={modalRef} onAnimationEnd={() => console.log('sdfsdffsdf')}>
        <div className='controlsModal'>
            <button className='controlsClose' onClick={requestClose}>Close</button>
            
            <h4>CONTROLS</h4>
            <p className='justified'>[SPACE] pause</p>
            <p className='justified'>[LEFT_ARROW/RIGHT_ARROW] playblack</p>
            <p className='justified'>[UP_ARROW/DOWN_ARROW] volume</p>
            <p className='justified'>[ESCAPE] main_menu</p>
        </div>
    </div>);
}

export default ControlsModal;