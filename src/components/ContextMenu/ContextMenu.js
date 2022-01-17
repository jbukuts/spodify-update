import './ContextMenu.css'

const ContextMenu = ({xPos, yPos, showMenu, innerMenu}) => {
    return (<div className='contextMenu'>
        {innerMenu}
    </div>)


}

export default ContextMenu;