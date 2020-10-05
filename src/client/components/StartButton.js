import React from 'react';
import { StyledStartButton } from './styles/StyledStartButton';

function StartButton({ callback } ){
    // params { callback, mainSocket, setStart, newGame}
    // onClick (() => callback(mainSocket, setStart, newGame))
    return (
        <StyledStartButton onClick={ () => callback() }>
            start button
        </StyledStartButton>
    );
}

export default StartButton;