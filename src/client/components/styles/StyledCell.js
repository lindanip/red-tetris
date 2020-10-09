import styled from 'styled-components';

export const StyledCell = styled.div`
    width: auto;
    background: rgba(${props => props.color}, 0.8);
    border: ${props => (props.type === 0 ? '1px solid' : '4px solid')};
    border-top-color: rgba(${props => props.color}, 0.1);
    border-right-color: rgba(${props => props.color}, 1);
    border-bottom-color: rgba(${props => props.color}, 1);
    border-left-color: rgba(${props => props.color}, 0.3);
`
export const StyledSpectraCell = styled.div`
	width: 10px;
    height: 10px;
	background: rgba(${(props) => props.color}, 0.8);
	border: ${(props) => (props.type === 0 ? '0px solid' : '4px solid')};
	border-bottom-color: rgba(${(props) => props.color}, 0.1);
	border-right-color: rgba(${(props) => props.color}, 1);
	border-top-color: rgba(${(props) => props.color}, 1);
	border-left-color: rgba(${(props) => props.color}, 0.3);
`;