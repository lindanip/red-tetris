import React from 'react';
import { StyledStage, StyledSpectraStage } from './styles/StyledStage';
import { Cell, SpectraCell} from './Cell';

export default function Stage({ stage }){
    return (
        <StyledStage width={stage[0].length} height={stage.length}>
            {stage.map(row => 
                row.map((cell, x) =>
                    <Cell key={x} type={cell[0]}/>
                )
            )}
        </StyledStage >
    );
}

export function SpectraStage({ player }){
   if (player.board) {
        return (
            <StyledSpectraStage>
                {
                    <div>{player.username}</div>
                }
                {
                    player.board.map((row, index) =>
                        <SpectraCell key={index} type={row[0]}/>
                    )
                }
            </StyledSpectraStage>
        );
   }
   return null;
}




// functsion StageTwo({ stage, type = 0 }){
//     if (type == 0)
//         return (
//             <StyledStage width={ stage[0].length } height={stage.length}>
//                 {   
//                     stage.map((row) =>
//                         row.map((cell, x) => <Cell key={x} type={cell[0]} />)
//                     )
//                 }
//             </StyledStage>
//         );
//     else
//         // must be styled to be small 
//         return (
//             <StyledStageE width={ stage[0].length } height={stage.length}>
//                 {   
//                     stage.map((row) =>
//                         row.map((cell, x) => <Cell key={x} type={cell[0]} />)
//                     )
//                 }
//             </StyledStageE>
//         );        
// }