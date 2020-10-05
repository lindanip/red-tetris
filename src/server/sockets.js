const Game = require('./classes/Game');
const Player = require('./classes/Player');
const Piece = require('./classes/Piece');
// const params = require('../../params');


function generateShapes(){
    
    let shapes = [];

    for(let i = 0; i< 50 ; i++)
        shapes.push(new Piece().randomTetrominos());
    
    return shapes;
}


function initEngine(io){

    let playersArray = [];

    io.on('connection', socket => {
        console.log('on connection');
        
        let room = new Game().room;
        let username = null;
    
        socket.on('joinRoomReq', hash => {
            if (hash){
                if (hash[0] === '#'){
                    let hashArray = hash.split('[');
                    room = hashArray[0].substr(1);
                    username = hashArray[1] ? 
                        hashArray[1].substr(0, hashArray[1].length - 1) : 'none';
                    socket.join(room);
                    let player = new Player(socket.id, username, room);
                    playersArray.push(player);
                    player = null;
                    io.to(room).emit('updatePlayers',
                        playersArray.filter(res => res.room === room)
                    );
                }
            }
        });

        socket.on('startGameReq', room => {
            console.log('on startGameReq');
            io.to(room).emit('startGameRes', room);
        });

        socket.on('shapesReq', room => {
            console.log('on shapesReq');
            io.to(room).emit('shapesRes', generateShapes());
        });

        socket.on('endGameReq', () => {
            console.log('on endGameReq');
            //
        });

        socket.on('disconnect', () => {
            console.log('on disconnect');
            //
        });

        // on updatePlayer
        // user died

        socket.on('rowCleared', () => {
            console.log('on rowCleared');
            socket.to(room).emit('rowPenalty');
        });

        socket.on('setWinner', winner => {
            console.log('on setWinner');
            //
        });

    });
}

module.exports = initEngine;