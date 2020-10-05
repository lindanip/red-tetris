import { useCallback } from 'react';
import io from 'socket.io-client';

export const socket = useCallback(() => {
    const socket = io.connect('http://localhost:3000');
    return socket;
}, []);