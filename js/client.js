const socket = io('https://bat-connect.onrender.com');

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
        msgText.innerText = parts.slice(1).join(': ');
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

document.getElementById('fileInp').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        socket.emit('send-file', { name: file.name, type: file.type, body: reader.result });
        append(`YOU: sent a file`, 'right');
    };
    reader.readAsDataURL(file);
});

socket.on('receive-file', data => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'left');
    
    const nameLabel = document.createElement('b');
    nameLabel.innerText = `${data.userName} shared a file:`;
    
    if (data.type && data.type.includes('image')) {
        const img = document.createElement('img');
        img.src = data.body;
        img.style.cssText = "display:block; max-width:250px; margin-top:5px;";
        messageElement.append(nameLabel, img);
    } else {
        const link = document.createElement('a');
        link.href = data.body;
        link.download = data.name;
        link.innerText = `Download ${data.name}`;
        link.style.cssText = "display:block; margin-top:5px;";
        messageElement.append(nameLabel, link);
    }

    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
});