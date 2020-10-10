import React from 'react';
import styled from 'styled-components';

const StyledStartButton = styled.button`
    background-color: green;
    padding: 9px;
    border: 1px solid black;
    margin-left: 12px;
`;

export default function StartButton({ callback }){
    return (
        <StyledStartButton onClick={ () => callback() }>
            start button
        </StyledStartButton>
    );
}