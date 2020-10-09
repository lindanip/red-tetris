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

    var allPlayers = [];

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
                    allPlayers.push(player);
                    player = null;

                    const findLeader = allPlayers.findIndex(player => player.room === room);
                    
                    if (allPlayers[findLeader].leader === false){
                        allPlayers[findLeader].leader = true;
                        io.to(allPlayers[findLeader].id).emit('crowned');
                    }
                    
                    io.to(room).emit('joinRoomRes', room);
                    io.to(room).emit('updateJoinedUsers',
                        allPlayers.filter(res => res.room === room)
                    );
                }
            }
        });

        socket.on('updatePlayerReq', player => {
            allPlayers = allPlayers.map(user => {
                if (user.id === socket.id)
                    user.board = [ ...player] // stage
                return user;
            });

            io.to(room).emit('updateJoinedUsers',
                allPlayers.filter(res => res.room === room)
            );
        });

        socket.on('startGameReq', room => {
            console.log('on startGameReq');
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
            console.log('on gameOverReq');
            socket.to(room).emit('userGameOverRes', userId);
        });

        socket.on('deadUser', userSocketId => {
            socket.to().emit();
        });

        socket.on('rowClearedCReq', () => {
            console.log('on rowCleared');
            socket.to(room).emit('rowClearedRes');
        });

        socket.on('shareMyStageCReq', ({ user, spectra }) => {
            socket.to(room).emit('shareMyStageSRes', { user , spectra });
        })

        socket.on('setWinnerReq', winner => {
            console.log('on setWinner');
            socket.nsp.to(room).emit('setWinnerRes', winner.username);
        });

        socket.on('disconnect', () => {
            allPlayers = allPlayers.filter(player => player.id !== socket.id)
            let newleader = allPlayers.findIndex(player => player.room === room);
        
            if (newleader !== -1) {
                allPlayers[newleader].leader = true;
                io.to(allPlayers[newleader].id).emit('crowned');
            }
            socket.to(room).emit('userLeftRes', socket.id);
        });
    });
}

module.exports = initEngine;