const params = require('../../params');
const server = require('./index');

server(params.server)
.then(() => console.log('not yet ready to play tetris with you...'))
.catch(() => console.log('something went wrong...'));