import { useState, useCallback } from 'react';

import { TETROMINOS, randomTetrominos } from '../tetrominos';
import { STAGE_WIDTH } from '../gameHelpers';

export function usePlayer()
{
    const [ player, setPlayer ] = useState({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false
    });

    const updatePlayerPos = ({ x, y, collided }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y)}, // works two way ?
            collided
        }));
    }

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH/ 2 - 2, y: 0 },
            tetromino: randomTetrominos().shape,
            collided: false
        }, []);
    });

    return [player, updatePlayerPos, resetPlayer];
}