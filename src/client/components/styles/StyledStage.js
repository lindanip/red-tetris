import styled from 'styled-components';

export const StyledStage = styled.div`
    display: grid;
    grid-template-rows : repeat(
        ${props => props.height},
        calc(252px / ${props => props.width})
    );

    grid-template-columns: repeat(${props => props.width}, 1fr);
    width: 100%;
    max-width: 252px;
`;

export const StyledSpectraStage = styled.div`
    display: flex;
    border: 1px solid black;
    height: 10px;
    padding: 5px;
`;