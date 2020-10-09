import React from 'react';
import { StyledCell, StyledSpectraCell } from './styles/StyledCell';
import { TETROMINOS } from '../tetrominos';

export function Cell({ type })
{
    return (
        <StyledCell type={type} color={TETROMINOS[type].color} />
      );
}

export function SpectraCell({ type })
{
    return (
        <StyledSpectraCell type={type} color={TETROMINOS[type].color} />
      );
}

// export defauult React.memo(cell);k
