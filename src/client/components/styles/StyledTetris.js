import styled from 'styled-components';

export const StyledTetrisWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

export const StyledTetris = styled.div`
    display: flex;
    align-items: flex-start;

    aside {
        display: block;
        width: 90%;
        height: 100%;
        margin-left: 5%;
        border: 3px solid red;
        background-color: rgba(0, 0, 0, 0.7);
    }
`;