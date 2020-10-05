import React from 'react';
import { StyledStartButton } from './styles/StyledStartButton';
import { startGame } from '../utils'

function StartButton({ setStage, resetPlayer, setGameOver} ){
    // params { callback, mainSocket, setStart, newGame}
    // onClick (() => callback(mainSocket, setStart, newGame))
    return (
        <StyledStartButton onClick={ () => 
            startGame(setStage, resetPlayer, setGameOver) 
        }>
            start button
        </StyledStartButton>
        );
}

export default StartButton;