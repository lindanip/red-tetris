import { checkCollision, createStage } from "./gameHelpers";
import { useInterval } from "./hooks/useInterval";

export function startGame(setStage, resetPlayer, setGameOver){
    setStage(createStage());
    resetPlayer();
    setGameOver(false);
    console.log('an x');
}

export function movePlayer(dir, updatePlayerPos, player, stage){
    if (!checkCollision(player, stage, { x: dir, y: 0 }))
        updatePlayerPos({ x: dir, y: 0 });
}

export function move({ keyCode }, gameOver, updatePlayerPos, player, stage)
{
    if (!gameOver)
        if (keyCode === 37)
            movePlayer(-1, updatePlayerPos, player, stage)
        else if (keyCode === 39)
            movePlayer(1, updatePlayerPos, player, stage)
        else if (keyCode === 40)
            dropPlayer(updatePlayerPos, player, stage)
        else if
            (keyCode === 38) rotatePlayer()
        // 38 up arrow ,   needs stage, and dir and import funtion
}

export function drop(updatePlayerPos){
    // collusion check
    updatePlayerPos({ x: 0, y: 1, collided: false });
}

// need to be the use interval hook
export function keyUp({ keyCode }){
    if (!gameOver){
        if (keyCode === 40)
            setDroptime(1000);
    }
}

export function dropPlayer(updatePlayerPos){
    // setDropTime(null);
    drop(updatePlayerPos);
}





// function drop()
// {
//     updatePlayerPos({ x: 0, y: 1, collided: false})

//     // if (!checkCollision(player, stage, {x: 0, y: 1}))
//     //     updatePlayerPos({ x: 0, y: 1, collided: false}); // going down by one
//     // else{
//     //     //Game over
//     //     if (player.pos.y < 1){
//     //         setGameOver(true);
//     //         setDropTime(null);
//     //     }
//     //     updatePlayerPos({x: 0, y: 0, collided: true});
//     // }
// }