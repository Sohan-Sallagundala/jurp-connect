const socket = io('https://bat-connect-backend.onrender.com');

const form = document.getElementById('send-container');
const messageInp = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', position);
    
    const nameSpan = document.createElement('b');
    const msgText = document.createElement('span');
    
    if (message.includes(': ')) {
        const parts = message.split(': ');
        nameSpan.innerText = parts[0];
        msgText.innerText = parts[1];
    } else {
        msgText.innerText = message;
    }

    messageElement.append(nameSpan, msgText);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

const login = () => {
    const groupName = document.getElementById('groupName').value;
    const userName = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (groupName && userName && password) {
        socket.emit('join-room', { groupName, password, userName });
    } else {
        alert("Enter all credentials, Detective.");
    }
};

socket.on('login-success', (name) => {
    document.getElementById('login-screen').style.display = 'none';
    append(`SYSTEM: Welcome to the channel, ${name}`, 'center');
});

socket.on('login-error', (msg) => alert(msg));

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInp.value;
    const groupName = document.getElementById('groupName').value;
    const userName = document.getElementById('username').value;

    if (message) {
        append(`YOU: ${message}`, 'right');
        socket.emit('send', { message, name: userName, room: groupName });
        messageInp.value = '';
    }
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('user-joined', name => {
    append(`SYSTEM: ${name} joined the transmission`, 'center');
});

// File Handling logic for your 'send-file' event
socket.on('receive-file', data => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'left');
    
    const nameLabel = document.createElement('b');
    nameLabel.innerText = `${data.userName} shared a file:`;
    
    const img = document.createElement('img');
    img.src = data.body;
    img.style.display = "block";
    
    messageElement.append(nameLabel, img);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
});