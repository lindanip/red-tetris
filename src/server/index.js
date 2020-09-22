const fs = require('fs');
// import debug from 'debug';

// const logError = debug('tetris:error');
// const logInfo = debug('tetris:info');

function initApp(app, params, callback)
{
    const { host, port } = params;

    const handler = (req, res) => {
        console.log('requests');
        const file = (( req.url === '/bundle.js') ? '/../../build/bundle.js' : '/../../index.html');

        fs.readFile(__dirname + file, (err, data) => {
            if (err){
                // logError(err);
                res.writeHead(500);
                return res.end('ERROR loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
    }

    app.on('request', handler);

    app.listen({ host, port }, () => {
        // logInfo(`tetris listening on port ${params.url}`);
        console.log(`tetris listening on port ${params.url}`);
        callback();
    });
}

function initEngine(io)
{
    io.on('connection', (socket) => {
        // logInfo(`Socket connected: ${socket.id}`);
        
        socket.on('action', action => {
            if (action.type === 'server/ping')
                socket.emit('action', { type: 'pong'});
        });
    });
}


const create = (params) => {
    const promise = new Promise((resolve, reject) => {
        try{
            const app = require('http').createServer();
            
            initApp(app, params, () => {
                const io = require('socket.io')(app);
                
                console.log(io);
                const stop = (callback) => {
                    io.close();
                    app.close(() => app.unref());

                    // logInfo(`Engine stopped.`);
                    callback();
                }

                initEngine(io);
                resolve({stop});
            });
        }catch (err){
            console.log(err);
            reject(err);
        }
    });

    return promise;
}
module.exports = create;