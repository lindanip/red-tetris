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
        else if (action.type === 'set_game_over') {
            let newPlayers = gameState.left.map(player => {
                if (player.id === action.payload.id){
                    console.log(player);
                    return { ...player, isGameOver: true }
                }
                return player;
            });
            console.log(newPlayers);
            return { ...gameState, left: newPlayers}; 
        }
        else {
            return gameState;
        }
    }
    return [ gameState, dispatch ];
}





