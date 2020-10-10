import { useReducer } from 'react';


export default function useGameState(){

    const [gameState, dispatch ] = useReducer(reduceGameState, {
        users: [], left: [] }
    );
    
    function reduceGameState(gameState,  action)
    {
        console.log(action);
        if (action.type === 'add_users')
            return { ...gameState, users: action.payload.users};
        else if (action.type === 'update_users_left') {
            const newUser = gameState.users.map(row => {
                return { ...row, board: null };
            });
            return { ...gameState, left: newUser }
        }
        else if (action.type === 'update_user_spectra') {
            const newUser = gameState.left.map(player => {
                if (player.id === action.payload.id)
                    return { ...player, board: action.payload.spectra };
                
                return player;
            });
    
            return { ...gameState, left: newUser }
        }
        // else if (action.type === 'remove_user') {
            
        // }
        else {
            return gameState;
        }
    }
    return [ gameState, dispatch ];
}





