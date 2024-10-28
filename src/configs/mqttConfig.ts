
import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'http://185.105.187.116:7008' ? undefined : 'http://185.105.187.116:7008'

export const socket = io(URL as string,{ transports : ["websocket" ,"polling","flashsocket"]});