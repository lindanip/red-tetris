const express = require("express");
const initEngine = require("./sockets");
const io = require("socket.io")();
const params = require('../../params');
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

function initApp(params, callback)
{
    const { port } = params;

    app.listen( port, () => {
        console.log(`tetris listening on port ${params.url}`);
        callback();
    });
}

function create(params)
{
    const promise = new Promise((resolve, reject) => {
        try{
            initApp(params, () => {
                const stop = (callback) => {
                    io.close();
                    // app.close(() => app.unref());
                    callback();
                }

                io.attach(2000, {
                    pingInterval: 10000,
                    pingTimeout: 5000,
                    cookie: false,
                });

                initEngine(io);
                resolve({ stop });
            });
        }catch (err){
            reject(err);
        }
    });
    return promise;
}
create(params.server)
.then(({ stop }) => {
    console.log('start');
})
.catch((err) => console.log(err));
