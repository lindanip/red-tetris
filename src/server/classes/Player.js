class Player{
    constructor (id, username, room){
        this.id = id;
        this.username = username;
        this.room = room;
        this.board = null;
    }
}

module.exports = Player;