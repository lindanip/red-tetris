import React, { useCallback, useState, useEffect } from 'react';
//import io from 'socket.io-client';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

import { useStage } from '../hooks/useStage';
import { usePlayer } from '../hooks/usePlayer';
import { useInterval } from '../hooks/useInterval';

import { StyledTetrisWrapper , StyledTetris } from './styles/StyledTetris';
import { createStage, checkCollision } from '../gameHelpers';

// let connection = null;
// let newGame = {
//     users: [],
//     left: [],
//     room: null,
// }

// function createConnection(){
//     return new Promise((resolve, reject) => {
//         if (!connection)
//         {
//             try{
//                 let connection = io.connect('http://localhost:2000');
//                 connection.emit('joinRoomReq', window.location.hash);
//                 resolve(connection);
//             }catch(e){
//                 reject(e);
//             }
//         }
//     })
// }
// function socketOn(socket,event, cb) {
//     console.log(socket)
//     socket.on(event, cb)
// }

// function socketEmit(socket,event, params = []) {
//     socket.emit(event, params)
// }

export default function Tetris()
{
    console.log('re-render');

    const [ gameOver, setGameOver ] = useState(false);
    const [ dropTime, setDropTime ] = useState(null);
    
    // const [ user, setUser ] = useState(null);
    // const [ winner, setWinner ] = useState(null);
    // const [ start, setStart ] = useState(false);
    // const [ shapes, setShapes ] = useState(null);

    // const [ host, setHost ] = useState(false);
    // const [ shapeTrack, setShapeTrack ] = useState(0);

    const [ player, updatePlayerPos, resetPlayer, playerRotate ] = usePlayer();
    // send in the setshapeTrack as param and add rowsCleared
    const [ stage, setStage ] = useStage(player, resetPlayer);

    function movePlayer(dir){
        console.log(dir);
        if (!checkCollision(player, stage, { x: dir, y: 0 }))
            updatePlayerPos({ x: dir, y: 0 });
    }

    function move({ keyCode })
    {
        if (!gameOver)
            if (keyCode === 37)
                movePlayer(-1);
            else if (keyCode === 39)
                movePlayer(1);
            else if (keyCode === 40)
                dropPlayer();
            else if (keyCode === 38)
                playerRotate(stage, 1);
    }

    function drop(){
        if (!checkCollision(player, stage, {x: 0, y: 1}))
            updatePlayerPos({ x: 0, y: 1, collided: false});
        else{
            if (player.pos.y < 1){
                console.log('game over!');
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({x: 0, y: 0, collided: true});
        }
    }

    function keyUp({ keyCode }){
        if (!gameOver){
            console.log('key up');
            if (keyCode === 40)
                setDropTime(1000);
        }
    }

    function dropPlayer(){
        setDropTime(null);
        drop(updatePlayerPos);
    }

    function startGame(){
        setStage(createStage());
        resetPlayer();
        setGameOver(false);
        setDropTime(1000);
        console.log('start game');
    }

    useInterval(() => {
        // setDropTime(null);
        drop();
    }, dropTime);

    return (
        <StyledTetrisWrapper
            role="button" 
            tabIndex="0" 
            onKeyDown={ e => move(e)}
            onKeyUp={ e => keyUp(e)}
        > 
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
                    <StartButton 
                    callback={ startGame }/>
                </aside> 
            </StyledTetris>
        </StyledTetrisWrapper>
    );
}






    // const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(
	// 	rowsCleared
	// );

    // const startGame = useCallback(() => {
    //     setStart(true);
    //     setStage(createStage());
    //     setDropTime(1000);
    //     // resetPlayer(); param shapes, shapeTrack, setPlayer
    //     setGameOver(false); // repeat ??
    //     setWinner(null);
    //     newGame.left = [...newGame.users];
    //     // setScore(0) setRows(0) setLevel(1)
    // // }, [resetPlayer, setStage, shapes]); // + setScore + setRows + setLevel

    // const connect = useCallback(async () => {
    //     if (!connection){
    //         connection = await createConnection();
            
    //         // socketOn(connection, 'updatePlayers', (p) => {
    //         //     console.log(p);
    //         // });

    //         socketOn(connection, 'startGameRes', (param) => {

    //         });

    //         socketOn(connection, 'shapesRes', (shapes) => {

    //         });

    //         // socketOn(connection, 'endGameReq', (p) => {

    //         // });

    //         // socketOn(connection, 'rowPenalty', (p) => {

    //         // });

    //         // socketOn(connection, 'setWinner', (username) => {

    //         // });

    //         // socketOn(connection, 'deadUser', (param) => {

    //         // });
    //     }
    // }, [connection]); // dep props.room + stage    

    // connect();
    // useEffect(() => {
    //     if (shapes)
    //         startGame(); //param list
    // }, [shapes, startGame]);

    // useEffect(() => {
    //     if (gameOver)
    //         setShapeTrack(0);
    // }, [gameOver, shapeTrack, setShapeTrack]);

    // // const useMountEffect = () => { // param fun + socket + newGame + setHost + setUser + setShapes + ++
    // //     useEffect(() => {
    // //         fun(params)
    // //     }, [])
    // // }

    // const callStartGame = () => { //param list
    //     socket.emit('start'); //param newGame.room
    //     setStart(true);
    // }

    // const keyUp();
    // const move();