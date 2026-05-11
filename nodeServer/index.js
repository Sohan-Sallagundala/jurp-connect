const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('bat-connect server is running');
});

const io = require('socket.io')(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

setInterval(() => {
    https.get('https://bat-connect.onrender.com', (res) => {}).on('error', (e) => {});
}, 4 * 60 * 1000);

io.on('connection', socket => {
    socket.on('join-room', (data) => {
        const group = data.groupName.trim().toLowerCase();
        const pass = data.password.trim();
        const user = data.userName.trim();
        const roomKey = `${group}_#_${pass}`;

        socket.join(roomKey);
        socket.roomName = roomKey;
        socket.userName = user;

        socket.emit('login-success', user);
        socket.to(roomKey).emit('receive', {
            message: `${user} joined the transmission`,
            name: 'SYSTEM'
        });
    });

    socket.on('send', (data) => {
        if (socket.roomName) {
            socket.to(socket.roomName).emit('receive', {
                message: data.message,
                name: socket.userName
            });
        }
    });

    socket.on('send-file', (fileData) => {
        if (socket.roomName) {
            socket.to(socket.roomName).emit('receive-file', {
                body: fileData.body,
                name: fileData.name,
                userName: socket.userName,
                type: fileData.type
            });
        }
    });

    socket.on('disconnect', () => {
        if (socket.roomName) {
            socket.to(socket.roomName).emit('receive', {
                message: `${socket.userName} disconnected`,
                name: 'SYSTEM'
            });
        }
    });
});

server.listen(PORT);