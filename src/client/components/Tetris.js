import React, { useCallback, useState, useEffect } from 'react';
import io from 'socket.io-client';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

import { useStage } from '../hooks/useStage';
import { usePlayer } from '../hooks/usePlayer';
import { useInterval } from '../hooks/useInterval';

import { StyledTetrisWrapper , StyledTetris } from './styles/StyledTetris';
import { createStage, checkCollision } from '../gameHelpers';

let connection = null;
let newGame = {
    users: [],
    left: [],
    room: null,
}

function createConnection(){
    return new Promise((resolve, reject) => {
        if (!connection){
            try{
                let connection = io.connect('http://localhost:2000');
                connection.emit('joinRoomReq', window.location.hash);
                resolve(connection);
            }catch(e){
                reject(e);
            }
        }
    });
}

export default function Tetris()
{
    console.log('re-render');
    // state and hooks
    const [ gameOver, setGameOver ] = useState(false);
    const [ dropTime, setDropTime ] = useState(null);
    const [ user, setUser ] = useState(null);
    const [ winner, setWinner ] = useState(null);
    const [ start, setStart ] = useState(false);
    const [ shapes, setShapes ] = useState(null);
    const [ gameLeader, setGameLeader ] = useState(false);
    const [ shapeCounter, setShapeCounter ] = useState(0);

    const [ player, updatePlayerPos, resetPlayer, playerRotate ]
        = usePlayer(shapeCounter);

    const [ stage, setStage, rowsCleared, addRow ]
        = useStage(player, resetPlayer, connection,  shapes, shapeCounter, setShapeCounter);
        // only setPlayer is not sent

    // component functions
    const startGame = useCallback(() => {
        
        console.log('start game');
        setStage(createStage());
        setGameOver(false);
        setDropTime(1000);
        setStart(true); // set game started
        resetPlayer(shapes, shapeCounter, setShapeCounter);
        newGame.left = [ ...newGame.users ]; // ????
        setWinner(null);
        // used a useCallback hook

    }, [resetPlayer, setStage, shapes] );

    const connect = useCallback(async function()
    {
        if (!connection)
        {        
            connection = await createConnection();
            
            connection.on('joinRoomRes', room => {
                newGame.room = room;
                console.log('joinRoomRes: ' + room);
            });

            connection.on('updateJoinedUsers', usersRes => {
                console.log('updated joined users');
                console.log(usersRes);
                console.log(newGame);
                newGame.users = usersRes;
                if (newGame.users[0] && newGame.users[0].id == connection.id)
                    setGameLeader(true);
                setUser(newGame.users.find((user) => user.id === connection.id));
            });

            connection.on('startGameRes', (room) => {
                console.log('startGameRes');
                connection.emit('updatePlayerReq', stage); // ????

                if (newGame.users[0] && newGame.users[0].id == connection.id)
                    connection.emit('getShapesReq', (room));
            });

            connection.on('getShapesRes', shapesRes => {
                console.log('getShapesRes');
                setShapes(shapesRes);
            });

            connection.on('deadUser', userId => {
                console.log('user dead');
                newGame.left.splice(
                    newGame.left.findIndex((e) => e.id === userId),
                    1
                );

                if (newGame.left.length === 1) { // if the user is only playing
                    setGameOver(true);
                    setDropTime(null);
                    connection.emit('winner', newGame.left[0]);
                }
            });

            connection.on('setWinner', (username) => {
                console.log('set winner');
                setStart(false);
                setWinner(username);
                connection.emit('updatePlayer', stage);
            });
        }
    }, []); // removed the stage as a depency

    function movePlayer(dir)
    {
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

    function endGame()
    {
        console.log('game over');
        setGameOver(true);
        setDropTime(null);
        setStart(false);
        setShapeCounter(0);
    }

    function drop(){
        // if !gameOver
        if (!checkCollision(player, stage, {x: 0, y: 1}))
            updatePlayerPos({ x: 0, y: 1, collided: false});
        else
        {
            if (player.pos.y < 1){
                // should no longer send spectra
                // and when our stage is fully display
                connection.emit('deadUser', connection.id);
                endGame();
            }
            updatePlayerPos({x: 0, y: 0, collided: true});
        }
    }

    function keyUp({ keyCode })
    {
        if (!gameOver){
            if (keyCode === 40)
                setDropTime(1000);
        }
    }

    function dropPlayer()
    {
        setDropTime(null);
        drop();
    }

    function callStartGame()
    {
        connection.emit('startGameReq', newGame.room);
        setStart(true);
    }

    // interval and effects
    useInterval(() => {
        drop();
    }, dropTime);

    useEffect(() => {
        if (shapes)
            startGame()
    }, [shapes, startGame]);

    useEffect(() => {
        connect();
    }, []);

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
                        (<Display gameOver={gameOver} text="Game Over" />) : null
                    }
                    { gameLeader ?
                        (<StartButton callback={ callStartGame }/>) : null
                    }
                </aside> 
            </StyledTetris>
        </StyledTetrisWrapper>
    );
}
