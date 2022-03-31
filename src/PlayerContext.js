import React, { Context } from 'react';

const PlayerContext = React.createContext([
    {},
    () => {}
]);

export const PlayerProvider = PlayerContext.Provider;
export default PlayerContext;