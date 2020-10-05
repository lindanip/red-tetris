import { useState, useCallback } from 'react';

import { randomTetrominos, TETROMINOS } from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';

export function usePlayer()
{
    const [ player, setPlayer ] = useState({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false
    });

    const rotate = (matrix, dir) => {
        // Make the rows to become cols (transpose)
        const rotatedTetro = matix.map((_ , index) =>
            matrix.map(col => col[index])
        );
        // reverse each row to get a rotated matix
        if (dir > 0)
            return rotatedTetro.map(row => row.reverse());
        return rotatedTetro.reverse();
    }

    const playerRotate = (stage, dir) => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

        // collied rotations
        // this is an advanced proccess
        // this will allow the tetromino to rotate within its self
        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = pos;
                return ;
            }
        }

        setPlayer(clonedPlayer);
    }

    const updatePlayerPos = ({ x, y, collided }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y)},
            collided
        }));
    }

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH/ 2 - 2, y: 0 },
            tetromino: randomTetrominos().shape,
            collided: false
        });
        // if (shapeTrack + 1 > shapes.length - 1) {
        //     setShapeTrack(0);
        // } else {
        //     setShapeTrack(shapeTrack + 1);
        // } this  setshape track will be a dependcy and param to hook
    }, []);

    //add 
    // const playerFall = stage => {
    //     const clonedPlayer = JSON.parse(JSON.stringify(player));
	// 	while (!checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
	// 		clonedPlayer.pos.y++;
	// 	}
	// 	clonedPlayer.pos.y--;
	// 	setPlayer(clonedPlayer);
    // }

    return [player, updatePlayerPos, resetPlayer, playerRotate];
}