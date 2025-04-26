const WebSocket = require('ws');

const IP = "192.168.194.156";
const wss = new WebSocket.Server({ host: IP, port: 8080 });
let Clients = {};



wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if(data.type == "connect") {
        console.log(data.id + " connected!");
        Clients[data.id] = ws;
      }
      else if(data.type == "reload") {
        console.log(data.layout);

        if(!Clients["flutter"]) {
          throw "Flutter agent is not connected";
        }
        Clients["flutter"].send(data.layout);
      } 
    } catch(e) {
      console.log("ERROR",e);
    }
    
  });

  ws.on('close', () => {
    console.log('A client disconnected');
  });
});

console.log(`WebSocket server is running on ws://${IP}:8080`);
