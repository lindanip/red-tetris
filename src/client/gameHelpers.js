export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

export function createStage(){
    return Array.from(Array(STAGE_HEIGHT), () => {
        return new Array(STAGE_WIDTH).fill([0, 'clear'])
    }); 
}

export function checkCollision(player, stage, { x: moveX, y: moveY }) 
{
    for (let y = 0; y < player.tetromino.length; y++) {
        for (let x = 0; x < player.tetromino[y].length; x++) {
            if (player.tetromino[y][x] !== 0) {
                if (
                    // check that our move is inside the game areas height (y)
                    // we shouldnt go through the bottom of the play area
                    !stage[y + player.pos.y + moveY] ||
                    //check that our move is inside the game areas width (x)
                    !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
                    // check that the cell we're moving to isnt set to clear
                    stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear' 
                ) {
                    return true;
                }
            }
        }
    }
}