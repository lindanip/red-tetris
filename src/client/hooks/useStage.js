import { useState, useEffect, useCallback } from 'react';
import { createStage } from '../gameHelpers';

export function useStage({ player, resetPlayer, connection, shapes, shapeCounter, setShapeCounter, user})
{
    const [ stage, setStage ] = useState(createStage());
    const [rowCleared, setRowsCleared ] = useState(0);

    const addUndesRow = useCallback((oldstage, n) =>{
        console.log(oldstage);
        console.log(n);
    })

    useEffect(() => {
        setRowsCleared(0);
        const sweepRows = (newStage) =>
        {
            return newStage.reduce((ack, row) => {
                if (row.findIndex(cell => cell[0] === 0 || cell[0] === 1) === -1) {
                    setRowsCleared(prevRowCleared => prevRowCleared + 1);
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    // connection.emit('rowClearedCReq', {n : rowCleared});
                    return ack;
                }
                ack.push(row);
                return ack;
            }, []);
        }

        const updateStage = prevStage => {
            // flush
            const newStage = prevStage.map(row => 
                row.map(cell => ( cell[1] === 'clear' ? [0, 'clear'] : cell ))
            );

            // draw
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0){
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`
                        ]
                    }                    
                });
            });

            const returnSpectra = () => {
                for (let y = 0; y < newStage.length; y++) {
                    for (let x = 0; x < newStage[0].length; x++){
                        if (newStage[y][x][1] === 'merged')
                            return newStage[y];
                    }
                }
                return ;
            }

            if (player.collided) {
                let spectra = returnSpectra();
                if (spectra){
                    connection.emit('shareMyStageCReq', { spectra });
                }

                resetPlayer(shapes, shapeCounter, setShapeCounter);

                let originalStage = sweepRows(newStage);
                return originalStage;
            }   
            return newStage;
        }
        setStage(prev => updateStage(prev));

    },[player.collided, player.pos.x, player.pos.y, player.tetromino]); //removed reset player as dependcy + shapeTrack + shapes
    
    return [stage, setStage, rowCleared, setRowsCleared, addUndesRow];
}
