<div align="center">

<img src="logo.png" alt="jurp-connect logo" width="120" />

# jurp-connect

**A terminal-style real-time chat application inspired by the Dark Knight's technology.**

[![Live Site](https://img.shields.io/badge/Live-jurp--connect.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://jurp-connect.vercel.app/)
[![Demo Video](https://img.shields.io/badge/Watch-Demo-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://lnkd.in/p/db4Hb7HT)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

</div>

---

## Demo

▶️ **[Watch the demo video](https://lnkd.in/p/db4Hb7HT)**

🌐 **[Try it live](https://jurp-connect.vercel.app/)**

---

## About

jurp-connect is a lightweight real-time chat app with a dark, terminal-inspired interface. Users join a shared room, and messages are delivered instantly to everyone connected through WebSockets powered by Socket.io.

## Features

- Real-time messaging with Socket.io
- Terminal-style dark interface
- Mobile-first responsive layout
- Join notifications when someone enters the chat
- Sound alert on incoming messages
- Separate frontend and backend deployments

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3 (mobile-first), JavaScript (ES6) |
| Backend | Node.js, Express |
| Realtime | Socket.io 4.x |
| Hosting | Vercel / GitHub Pages (frontend), Render (backend) |

## Project Structure

```
jurp-connect/
├── index.html        
├── style.css         
├── logo.png          
├── ting.mp3          
├── js/               
│   └── client.js
├── nodeServer/       
│   ├── index.js
│   └── package.json
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- npm

### Run the backend

```bash
git clone https://github.com/Sohan-Sallagundala/jurp-connect.git
cd jurp-connect/nodeServer
npm install
node index.js
```

The server starts on `http://localhost:8000` by default.

### Run the frontend

Open `index.html` in your browser, or serve the project root with any static server:

```bash
npx serve .
```

To point the client at your local backend, update the socket connection URL in `js/client.js`:

```js
const socket = io("http://localhost:8000");
```

## Deployment

| Service | URL |
| --- | --- |
| Frontend | https://jurp-connect.vercel.app/ |
| Backend | https://bat-connect-backend.onrender.com |

> The backend runs on Render's free tier, so the first request after a period of inactivity can take up to a minute while the server wakes up.

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

## Author

**Sohan Sallagundala** · [@Sohan-Sallagundala](https://github.com/Sohan-Sallagundala)
