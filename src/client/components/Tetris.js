import React, { useCallback, useState, useEffect } from 'react';
import io from 'socket.io-client';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

import { useStage } from '../hooks/useStage';
import { usePlayer } from '../hooks/usePlayer';
import { useInterval } from '../hooks/useInterval';

import { StyledTetrisWrapper , StyledTetris } from './styles/StyledTetris';

import { startGame, move, drop } from '../utils';
import { createStage } from '../gameHelpers';

let connection = null;
let newGame = {
    users: [],
    left: [],
    room: null,
}

function createConnection(){
    return new Promise((resolve, reject) => {
        if (!connection)
        {
            try{
                let connection = io.connect('http://localhost:2000');
                connection.emit('joinRoomReq', window.location.hash);
                resolve(connection);
            }catch(e){
                reject(e);
            }
        }
    })
}
function socketOn(socket,event, cb) {
    console.log(socket)
    socket.on(event, cb)
}

function socketEmit(socket,event, params = []) {
    socket.emit(event, params)
}


export default function Tetris()
{
    const [ gameOver, setGameOver ] = useState(false);
    const [ dropTime, setDropTime ] = useState(null);
    
    const [ user, setUser ] = useState(null);
    const [ winner, setWinner ] = useState(null);
    const [ start, setStart ] = useState(false);
    const [ shapes, setShapes ] = useState(null);

    const [ host, setHost ] = useState(false);
    const [ shapeTrack, setShapeTrack ] = useState(0);

    const [ player, updatePlayerPos, resetPlayer ] = usePlayer();
    // send in the setshapeTrack as param
    const [ stage, setStage ] = useStage(player, resetPlayer);




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
    // }, [resetPlayer, setStage, shapes]); // + setScore + setRows + setLevel

    const connect = useCallback(async () => {
        if (!connection){
            connection = await createConnection();
            
            // socketOn(connection, 'updatePlayers', (p) => {
            //     console.log(p);
            // });

            socketOn(connection, 'startGameRes', (param) => {

            });

            socketOn(connection, 'shapesRes', (shapes) => {

            });

            // socketOn(connection, 'endGameReq', (p) => {

            // });

            // socketOn(connection, 'rowPenalty', (p) => {

            // });

            // socketOn(connection, 'setWinner', (username) => {

            // });

            // socketOn(connection, 'deadUser', (param) => {

            // });
        }
    }, [connection]); // dep props.room + stage    

    connect();
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








    return (
        <StyledTetrisWrapper
            role="button" 
            tabIndex="0" 
            onKeyDown={ e => move( e, gameOver, updatePlayerPos, player, stage )}
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
                    <StartButton setStage={ setStage } 
                        resetPlayer={ resetPlayer }
                        setGameOver={ setGameOver }
                    callback={setStage, resetPlayer, setGameOver }/>
                </aside> 
            </StyledTetris>
        </StyledTetrisWrapper>
    );
}
