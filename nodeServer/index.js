const http = require('http');
const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('bat-connect server is running');
});

const io = require('socket.io')(server, {
    maxHttpBufferSize: 1e10,
    cors: {
        origin: [
            "https://sohan-sallagundala.github.io", 
            "https://sohan-sallagundala.github.io/bat-connect"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

server.listen(PORT);

setInterval(() => {
    http.get('https://bat-connect.onrender.com');
}, 4 * 60 * 1000);

io.on('connection', socket => {
    socket.on('join-room', (data) => {
        const { groupName, password, userName } = data;
        const roomKey = `${groupName}__${password}`;

        socket.join(roomKey);
        socket.roomName = roomKey;
        socket.userName = userName;

        socket.emit('login-success', userName);
        socket.to(roomKey).emit('receive', {
            message: `${userName} joined the transmission`,
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