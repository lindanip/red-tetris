const Game = require('./classes/Game');
const Player = require('./classes/Player');
const Piece = require('./classes/Piece');

function generateShapes(){   
    let shapes = [];

    for (let i = 0; i < 50 ; i++)
        shapes.push(new Piece().randomTetrominos());
    
    return shapes;
}

function initEngine(io)
{
    var allPlayers = [];

    io.on('connection', socket =>
    {
        console.log('connection...');
        let room = new Game().room;
        let username = null;
    
        socket.on('joinRoomReq', hash =>
        {
            if (hash) {
                if (hash[0] === '#') {
                    
                    let hashArray = hash.split('[');
                    room = hashArray[0].substr(1);
                    
                    username = hashArray[1] ? 
                        hashArray[1].substr(0, hashArray[1].length - 1) :
                        'none';
                    
                    socket.join(room);
                    
                    let player = new Player(socket.id, username, room);
                    allPlayers.push(player);
                    player = null;

                    let findLeader = allPlayers.findIndex(player => player.room === room);
                    
                    if (allPlayers[findLeader].leader === false) {
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

        socket.on('startGameReq', room => {
            console.log('on start game req ....');
            io.to(room).emit('startGameRes', generateShapes());
        });

        socket.on('gameOverCReq', () =>
        {
            let index = allPlayers.findIndex(row => row.id === socket.id);
            if (index !== -1)
                allPlayers[index].isGameOver = true;

            let temp = allPlayers.filter(player => player.room == room);
            let checkWinner = 0;

            for (let i = 0; i < temp.length; i++) {
                if (temp[i].isGameOver == false && temp[i].room == room)
                    checkWinner++;
            }

            if (checkWinner == 1) {
                for (let i = 0; i < temp.length; i++) {
                    if (temp[i].isGameOver == false && temp[i].room == room) {
                        io.to(room).emit('setWinner', {id : temp[i].id, playerName: temp[i].username});
                        break ;
                    }
                }
            }
            socket.to(room).emit('deadPlayer', {id: socket.id});
        });

        socket.on('rowClearedCReq', () => {
            console.log('on row cleared ...');
            socket.to(room).emit('rowClearedSRes');
        });

        socket.on('shareMyStageCReq', ({ spectra }) => {
            socket.to(room).emit('shareMyStageSRes', { id: socket.id, spectra });
        })

        socket.on('setWinnerReq', winner => {
            socket.nsp.to(room).emit('setWinnerRes', winner.username);
        });

        socket.on('disconnect', () => {
            allPlayers = allPlayers.filter(player => player.id !== socket.id)
            let newleader = allPlayers.findIndex(player => player.room === room);
        
            if (newleader !== -1) {
                allPlayers[newleader].leader = true;
                io.to(allPlayers[newleader].id).emit('crowned');
            }
            socket.to(room).emit('playerBailed', socket.id);
        });
    });
}

module.exports = initEngine;