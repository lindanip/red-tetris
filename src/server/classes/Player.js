const Game = require('./Game');

class Player extends Game{
    constructor (id, username, room){
        super(room);
        this.id = id;
        this.username = username;
        // this.room = room;
        this.board = null;
        this.leader = false;
    }
}

module.exports = Player;