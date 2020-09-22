import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export function useStage(player, resetPlayer)
{
    const [ stage, setStage ] = useState(createStage());

    useEffect(() => {

        const updateStage = prevStage => {
            
            //flushing the stage
            const newStage = prevStage.map(row => 
                ( row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)) )
            );

            //drawing the tetromino
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`
                        ];
                    }
                });
            });

            // check if we collided
            if (player.collided) {
                resetPlayer();
            }

            return newStage;
        }

        setStage( prev => updateStage(prev));
    }, [player.collided, player.pos.x, player.pos.y, player.tetromino, resetPlayer]);
    // player.collided, player.pos.x, player.pos.y, player.tetromino
    return [stage, setStage];
}