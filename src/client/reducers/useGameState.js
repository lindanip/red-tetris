import { useReducer } from 'react';
import { ACTIONS } from '../gameHelpers';

export default function useGameState(){

    const [gameState, dispatch ] = useReducer(reduceGameState, {
        users: [], left: [] }
    );
    
    function reduceGameState(gameState,  action)
    {
        console.log(action);
        if (action.type === ACTIONS.ADD_PLAYER)
        {
            return { ...gameState, users: action.payload.users};
        }            
        else if (action.type === 'update_users_left')
        {
            const newUser = gameState.users.map(row => {
                return { ...row, board: null };
            });
            return { ...gameState, left: newUser }
        }
        else if (action.type === ACTIONS.UPDATE_PLAYER_SPECTRA)
        {
            const newPlayers = gameState.left.map(player => {
                if (player.id === action.payload.id)
                    return { ...player, board: action.payload.spectra };
                
                return player;
            });
    
            return { ...gameState, left: newPlayers }
        }
        else if (action.type === ACTIONS.PLAYER_GAME_OVER)
        {
            let newPlayers = gameState.left.map(player => {
                if (player.id === action.payload.id){
                    console.log(player);
                    return { ...player, isGameOver: true }
                }
                return player;
            });
            return { ...gameState, left: newPlayers}; 
        }
        else if (action.type === ACTIONS.REMOVE_PLAYER)
        {
            return { ...gameState, left: gameState.left.filter(player => 
                player.id !== action.payload.id
            )};
        }
        else
        {
            return gameState;
        }
    }
    return [ gameState, dispatch ];
}





