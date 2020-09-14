import React, { useState } from 'react';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

import { useStage } from '../hooks/useStage';
import { usePlayer } from '../hooks/usePlayer';

import { StyledTetrisWrapper , StyledTetris } from './styles/StyledTetris';

import { createStage, checkCollision } from '../gameHelpers';

function Tetris()
{
    const [ gameOver, setGameOver ] = useState(false);
    const [ dropTime, setDropTime ] = useState(null); // is for the level and movement speed of tetromino

    const [ player, updatePlayerPos, resetPlayer ] = usePlayer();
    const [ stage, setStage ] = useStage(player, resetPlayer); // sending pos, tetromino, collided are sent of the user
    
    function movePlayer(dir) {
        if (!checkCollision(player, stage, {x: dir, y: 0}))
            updatePlayerPos({ x: dir, y: 0}); // from the key left right (dir)
    }

    function startGame()
    {
        //reset everthing
        setStage(createStage()); // reset the stage
        resetPlayer(); // reset the player 
        setGameOver(false);
    }

    function drop()
    {
        if (!checkCollision(player, stage, {x: 0, y: 1}))
            updatePlayerPos({ x: 0, y: 1, collided: false}); // going down by one
        else{
            //Game over
            if (player.pos.y < 1){
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({x: 0, y: 0, collided: true});
        }
    }

    function dropPlayer()
    {
        drop();
    }

    function move({ keyCode })
    {
        console.log('key down');

        if (!gameOver){
            if (keyCode === 37){
                movePlayer(-1); // left
            }else if (keyCode === 39){
                movePlayer(1); // right
            }else if (keyCode === 40){
                dropPlayer(); // down
            }
        }
    }
    
    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={ e => move(e)}> 
            <StyledTetris>
                <Stage stage={stage}/>
                <aside>
                    { gameOver ?
                        ( <Display gameOver={gameOver} text="Game Over" />) : 
                        (<div>
                            <Display text="Score"/>
                            <Display text="Rows"/>
                            <Display text="Level"/>
                        </div>)
                    }
                    <StartButton callback={startGame}/>
                </aside> 
            </StyledTetris>
        </StyledTetrisWrapper>
    );
}

export default Tetris;