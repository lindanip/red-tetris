import React, { useCallback, useState, useEffect, useReducer } from 'react';
import io from 'socket.io-client';

import Stage, { SpectraStage } from './Stage';
import Display from './Display';
import StartButton from './StartButton';

import { useStage } from '../hooks/useStage';
import { usePlayer } from '../hooks/usePlayer';
import { useInterval } from '../hooks/useInterval';

import { StyledTetrisWrapper , StyledTetris } from './styles/StyledTetris';
import { createStage, checkCollision } from '../gameHelpers';

export let connection = null;
let newGame = {
    users: [],
    left: [],
    room: null,
}

function createConnection()
{
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


const ACTIONS = {
    ADD_USER: 'add_user',
    UPDATE_USER_STAGE: 'update_user_stage',
    REMOVE_USER: 'remove_user'
};


function reduceGameState(gameState,  action)
{
    if (action.type === 'add_users')
        return { ...gameState, users: action.payload.users};
    else if (action.type === 'update_users_left') {
        const newUser = gameState.users.map(row => {
            return { ...row, board: null };
        });
        return { ...gameState, left: newUser }
    }
    else if (action.type === 'update_user_spectra') {
        const newUser = gameState.users.map(row => {
            if (row.username === action.payload.usernameRes)
                return { ...row, board: action.payload.spectra };
            
            return row;
        });
        return { ...gameState, left: newUser }
    }
    // else if (action.type === 'remove_user') {
        
    // }
    else {
        return gameState;
    }
}


export default function Tetris()
{
    console.log('re-render');
    
    const [gameState, dispatch ] = useReducer(reduceGameState, {
        users: [], left: [] });
    const [ abc, setAbc ] = useState(0);
    const [ roomState, setRoomState ] = useState(null);
    const [ gameOver, setGameOver ] = useState(false);
    const [ dropTime, setDropTime ] = useState(null);
    const [ user, setUser ] = useState(null); // has player object used for display
    const [ winner, setWinner ] = useState(null);
    const [ start, setStart ] = useState(false);
    const [ shapes, setShapes ] = useState(null);
    const [ gameLeader, setGameLeader ] = useState(false);
    const [ shapeCounter, setShapeCounter ] = useState(0);

    const [ player, updatePlayerPos, resetPlayer, playerRotate ]
        = usePlayer(shapeCounter);

    const [ stage, setStage, rowsCleared, addRow ]
        = useStage({ player, resetPlayer, connection,  shapes,
            shapeCounter, setShapeCounter, user });
        // only setPlayer is not sent

    
    const startGame = useCallback(() => {

        console.log('start game');
        setStage(createStage());
        setGameOver(false);
        setDropTime(1000);
        setStart(true); // set game started
        resetPlayer(shapes, shapeCounter, setShapeCounter);
        
        newGame.left = [ ...newGame.users ];
        dispatch({ type: 'update_users_left' });
        dispatch({ type: 'left_to_single_array'});
       
        setWinner(null);
    }, [resetPlayer, setStage, shapes] );

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
                newGame.users = usersRes;
                dispatch({ type: 'add_users', payload: { users: usersRes }});
                setUser(newGame.users.find((user) => user.id === connection.id));
            });

            connection.on('shareMyStageSRes', ({ user: usernameRes, spectra }) => {
                dispatch({type: 'update_user_spectra', payload: { usernameRes, spectra }});
            });

            connection.on('startGameRes', (room) => {
                console.log('startGameRes');
                connection.emit('updatePlayerReq', stage); // send stage back to be updated in allPlayers array

                // must also ssend mine backk
                // && newGame.users[0].id == connection.id 
                if (newGame.users[0])
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
        return connection.emit('disconnect');
    }, []);

    
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
        if (!gameOver && keyCode === 40)
            setDropTime(1000);
    }

    function dropPlayer()
    {
        setDropTime(null);
        drop();
    }

    function callStartGame()
    {
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
                    { user ? (<p>{ user.username }</p>) : null }
                    { gameOver ? (<p>game over</p>) : null }
                    { start ? null: 
                        gameLeader ?
                            (<StartButton callback={ callStartGame }/>) :
                            (<p>waiting for leader to start game</p>)
                    }
                    {
                        // check with socket id
                        gameState.left.map((playerObj, index) => {
                            return (playerObj.username !== user.username ?
                                <SpectraStage key={index} player={playerObj}/> :
                                null
                            )   
                        })
                    }
                    
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
}
