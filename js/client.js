const socket = io('https://bat-connect.onrender.com', {
    transports: ['websocket'] 
});

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const fileInp = document.getElementById('fileInp');
const audio = new Audio('ting.mp3');

function login() {
    const group = document.getElementById('groupName').value.trim();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    
    if (group && user && pass) {
        socket.emit('join-room', { 
            groupName: group, 
            userName: user, 
            password: pass 
        });
    } else {
        alert("Please fill all fields");
    }
}

socket.on('login-success', (userName) => {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('nav h1').innerText = "Active Channel: " + document.getElementById('groupName').value;
});

socket.on('login-error', (msg) => {
    alert(msg);
});

const append = (message, position, isHTML = false) => {
    const messageElement = document.createElement('div');
    if (isHTML) {
        messageElement.innerHTML = message;
    } else {
        messageElement.innerText = message;
    }
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play().catch(() => {});
    }
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', { message: message });
        messageInput.value = '';
    }
});

fileInp.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        const fileData = { name: file.name, type: file.type, body: reader.result };
        append(`You sent: ${file.name}`, 'right');
        socket.emit('send-file', fileData);
    };
    reader.readAsDataURL(file);
});

socket.on('receive', data => {
    let displayName, displayMsg;
    if (typeof data === 'object' && data !== null) {
        displayName = data.name || "SYSTEM";
        displayMsg = data.message || "";
    } else {
        displayName = "Remote User";
        displayMsg = data;
    }
    if (displayMsg) {
        let pos = displayName === 'SYSTEM' ? 'center' : 'left';
        append(displayName === 'SYSTEM' ? displayMsg : `${displayName}: ${displayMsg}`, pos);
    }
});

window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = 'If you refresh, the transmission history will be lost. Continue?';
});

socket.on('receive-file', data => {
    let content = '';
    if (data.type.includes('image')) {
        content = `<img src="${data.body}" style="max-width:250px; display:block; margin-bottom:5px;">`;
    }
    const link = `<a href="${data.body}" download="${data.name}">Download ${data.name}</a>`;
    append(`<b>${data.userName}:</b><br>${content}${link}`, 'left', true);
});