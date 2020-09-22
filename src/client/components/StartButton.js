import React from 'react';
import { StyledStartButton } from './styles/StyledStartButton';

function StartButton({ callback }){
    return (
        <StyledStartButton onClick={ callback }>
            start button
        </StyledStartButton>
        );
}

export default StartButton;