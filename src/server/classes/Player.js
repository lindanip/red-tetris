const Game = require('./Game');

class Player extends Game{
    constructor (id, username, room){
        super(room);
        this.id = id;
        this.username = username;
        this.isGameOver = false;
        this.board = null;
        this.leader = false;
    }
}

module.exports = Player;