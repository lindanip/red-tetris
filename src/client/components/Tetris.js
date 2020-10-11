import React, { useCallback, useState, useEffect } from 'react';

import Stage, { SpectraStage } from './Stage';
import Display from './Display';
import StartButton from './StartButton';

import { useStage } from '../hooks/useStage';
import { usePlayer } from '../hooks/usePlayer';
import { useInterval } from '../hooks/useInterval';
import useGameState from '../reducers/useGameState';

import { StyledTetrisWrapper , StyledTetris } from './styles/StyledTetris';
import { createStage, checkCollision, ACTIONS } from '../gameHelpers';
import { createConnection } from '../sockets';

export let connection = null; 

export default function Tetris()
{
    console.log('re-render');

    const [ gameState, dispatch] = useGameState();
    // console.log(gameState);
    const [ roomState, setRoomState ] = useState(null);
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
    const [ stage, setStage, rowsCleared, setRowsCleared, addUndesRow ]
        = useStage({ player, resetPlayer, connection,  shapes,
            shapeCounter, setShapeCounter, user });   

    if (rowsCleared > 0) {
        console.log(rowsCleared);
        for (let i = 0; i < rowsCleared; i++)
            connection.emit('rowClearedCReq', {n : rowsCleared});
        setRowsCleared(0);
        console.log(rowsCleared);
    }

    function endGame()
    {
        console.log('game over');
        setGameOver(true);
        setDropTime(null);
        setStart(false);
        setShapeCounter(0);
    }
    
    const startGame = useCallback(function()
    {
        console.log('start game');
        setStage(createStage());
        setGameOver(false);
        setDropTime(1000);
        setStart(true);
        resetPlayer(shapes, shapeCounter, setShapeCounter);
        dispatch({ type: 'update_users_left' });
        setWinner(null);
    }, [shapes] );

    const connect = useCallback(async function()
    {
        if (!connection)
        {        
            connection = await createConnection();
            
            connection.on('joinRoomRes', room => {
                setRoomState(room);
            });

            connection.on('crowned',() => {
                setGameLeader(true);
            });

            connection.on('updateJoinedUsers', usersRes => {
                setUser(gameState.users.find((user) => user.id === connection.id));

                dispatch({ type: ACTIONS.ADD_PLAYER, payload: { users: usersRes }});
            });

            connection.on('shareMyStageSRes', ({ id , spectra }) => {
                dispatch({type: ACTIONS.UPDATE_PLAYER_SPECTRA, payload: { id,  spectra }});
            });

            connection.on('startGameRes', (shapesRes) => {
                setShapes(shapesRes);
            });

            connection.on('deadPlayer', ({id}) => {
                console.log('player dead', id);
                dispatch({type: ACTIONS.PLAYER_GAME_OVER, payload: {id}});
            });

            connection.on('setWinner', ({id}) => {
                setWinner(id);
                endGame();
            });

            connection.on('rowClearedSRes', ({n, id}) => {
                setDropTime(null);

                setStage(prevStage => {
                    for (let i = 1; i < prevStage.length; i++){
                        prevStage[i - 1] = [ ...prevStage[i]];
                    }
                    prevStage[prevStage.length - 1] = new Array(prevStage[0].length).fill([1, 'meged']);
                    return (prevStage);
                });

                updatePlayerPos({ x: 0, y: 0, collided: false });
                setDropTime(1000);
            });

            connection.on('playerBailed', ({id}) => {
                console.log(id);
                dispatch({type: ACTIONS.REMOVE_PLAYER, payload: {id}});
            });
        }
        return connection.emit('disconnect');
    }, []);

    function movePlayer(dir){
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

    function drop()
    {
        if (!checkCollision(player, stage, {x: 0, y: 1}))
            updatePlayerPos({ x: 0, y: 1, collided: false});
        else
        {
            if (player.pos.y < 1){
                connection.emit('gameOverCReq');
                setGameOver(true);
                setDropTime(null);
                setShapeCounter(0);
            }
            updatePlayerPos({x: 0, y: 0, collided: true});
        }
    }

    function keyUp({ keyCode }){
        if (!gameOver && keyCode === 40)
            setDropTime(1000);
    }

    function dropPlayer(){
        setDropTime(null);
        drop();
    }

    function callStartGame(){
        connection.emit('startGameReq', roomState);
    }


    useInterval(() => {
        drop();
    }, dropTime);

    useEffect(() => {
        if (shapes)
            startGame()
    }, [shapes]);

    useEffect(() => {
        const callback = connect();
        return () => callback;
    }, []);

    // check if there is a wwinner or not before we display the button
    // console.log(gameState);
    let gameOverText = 'game over',
        waitingText = 'waiting for leader to start game',
        winnerText = 'you are the winner';
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
                    { user ? (<Display text={user.username }/>) : null }
                    { gameOver ? (<Display text={gameOverText} />) : null }
                    { start ? null: 
                        gameLeader ?
                            (<StartButton callback={ callStartGame }/>) :
                            (<Display text={waitingText} />)
                    }
                    {
                        gameState.left.map((playerObj, index) => {
                            return (playerObj.id !== connection.id ?
                                <SpectraStage key={index} player={playerObj}/> :
                                null
                            )   
                        })
                    }
                    {
                       !winner ? null: 
                            winner == connection.id ?
                            (<Display text={winnerText}/>):
                            (<div>{
                                gameState.left.map((player, index) => 
                                    (player.id == winner) ? 
                                        (<div key={index}>{player.username} has won</div>) :
                                        null
                                )
                            }</div>)
                    }
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
}
