const Game = require('./classes/Game');
const Player = require('./classes/Player');
const Piece = require('./classes/Piece');

function generateShapes(){
    
    let shapes = [];

    for (let i = 0; i < 50 ; i++)
        shapes.push(new Piece().randomTetrominos());
    
    return shapes;
}


function initEngine(io){

    let allUsers = [];

    io.on('connection', socket => {
        
        console.log('on connection');
        
        let room = new Game().room;
        let username = null;
    
        socket.on('joinRoomReq', hash => {
            // !for multiplayer user
            if (hash){
                if (hash[0] === '#'){
                    
                    let hashArray = hash.split('[');
                    room = hashArray[0].substr(1);
                    
                    username = hashArray[1] ? 
                        hashArray[1].substr(0, hashArray[1].length - 1) :
                        'none';
                    
                    socket.join(room);
                    
                    let player = new Player(socket.id, username, room);
                    allUsers.push(player);
                    player = null;

                    io.to(room).emit('joinRoomRes', room);

                    io.to(room).emit('updateJoinedUsers',
                        allUsers.filter(res => res.room === room)
                    );
                }
            }
        });

        socket.on('updatePlayerReq', player => {
            allUsers = allUsers.map(user => {
                if (user.id === socket.id)
                    user.board = [ ...player]
                return user;
            });

            io.to(room).emit('updateJoinedUsers',
                allUsers.filter(res => res.room === room)
            );
        });

        socket.on('startGameReq', room => {
            console.log('on startGameReq');
            console.log(room);
            io.to(room).emit('startGameRes', room);
        });

        socket.on('getShapesReq', room => {
            console.log('on shapesReq');
            io.to(room).emit('getShapesRes', generateShapes());
        });

        socket.on('endGameReq', () => {
            console.log('on endGameReq');
        });

        socket.on('userGameOverReq', userId => {
            socket.to(room).emit('userGameOverRes', userId);
        });

        socket.on('rowClearedReq', () => {
            console.log('on rowCleared');
            socket.to(room).emit('rowClearedRes');
        });

        socket.on('setWinnerReq', winner => {
            console.log('on setWinner');
            socket.nsp.to(room).emit('setWinnerRes', winner.username);
        });

        socket.on('disconnect', () => {
            console.log('on disconnect');
            allUsers.splice(allUsers.findIndex(user => {
                user.id == socket.id &&
                user.room == room, 1
            }));
            socket.to(room).emit('userLeftRes', socket.id);
        });
    });
}

module.exports = initEngine;