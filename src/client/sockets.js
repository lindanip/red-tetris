// import { useCallback } from 'react';;
import io from 'socket.io-client';

export function createConnection()
{
    return new Promise((resolve, reject) => {
        try{
            let connection = io.connect('http://localhost:2000');
            connection.emit('joinRoomReq', window.location.hash);
            resolve(connection);
        }catch(e){
            reject(e);
        }
    });
}