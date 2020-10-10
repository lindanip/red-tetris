import React from 'react';
import styled from 'styled-components';

const StyledDisplay = styled.div`
    font-size: 18px;
    color: white;
    padding: 6px;
    margin-left: 12px;
`;

function Display({ text }){
    return (
        <StyledDisplay>{ text }</StyledDisplay>
    );
}

export default Display;