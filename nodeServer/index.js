const PORT = process.env.PORT || 8000;
const io = require('socket.io')(PORT, {
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

const rooms = {};

io.on('connection', socket => {

    socket.on('join-room', (data) => {
        const { groupName, password, userName } = data;

        if (!rooms[groupName]) {
            rooms[groupName] = password;
        }

        if (rooms[groupName] === password) {
            socket.join(groupName);
            socket.roomName = groupName;
            socket.userName = userName;

            socket.emit('login-success', userName);
            socket.to(groupName).emit('user-joined', userName);
        } else {
            socket.emit('login-error', "Incorrect Channel Key");
        }
    });

    socket.on('send', (data) => {
        socket.to(data.room).emit('receive', {
            message: data.message,
            name: data.name
        });
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

            setTimeout(() => {
                const clientsInRoom = io.sockets.adapter.rooms.get(socket.roomName);
                if (!clientsInRoom || clientsInRoom.size === 0) {
                    delete rooms[socket.roomName];
                }
            }, 0);
        }
    });

});