import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';


const messages = [
    {
        message: "Test message",
        id: "1243123",
        user: {id: "qwerqwerqwer", name: "User"}
    },
]

const app = express();
app.use(cors());
// app.use(cors({
//     origin: 'https://websocket-chat-frontend.vercel.app', // Разрешить запросы с вашего домена на Vercel
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // Если вам нужны куки или авторизация
// }));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",  // Замените на адрес вашего клиента
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (message) => {
        console.log('Received message:', message);
    });
    socket.on('client-message-sent', message => {
        const messageItem = {
            message: message,
            id: new Date().getTime().toString(),
            user: {id: "qwerqwerqwer", name: "Zanzi"}
        }
        messages.push(messageItem)
        console.log(message)
        io.emit('new-message-sent', messageItem)
    })

    socket.on('disconnect', (reason) => {
        console.log('Client disconnected due to:', reason);
    });

    socket.emit('init-messages', messages);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));