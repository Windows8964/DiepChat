const WebSocket = require('ws')
const fs = require('fs');

process.on('uncaughtExeption', console.log)
const wss = new WebSocket.Server({ port: 8080 });
let creds = require('./creds.json');

wss.on('connection', ws => {
  ws.id = Math.random().toString(16).substr(2);
  console.log('connection');
  ws.on('message', (msg) => {
    if (typeof msg !== 'string') return ws.close(1020, 'you are bad');
    try
    {
      msg = JSON.parse(msg);
    }
    catch
    {
      return ws.close(1020, 'you are still bad');
    }
    if (!(msg instanceof Object)) return ws.close(1020, 'you are really bad');
    console.log(msg);
    switch (msg.type)
    {
//      case 'create': return signup(ws, msg, ws._socket.remoteAddress);
//      case 'login': return login(ws, msg);
      case 'message': { sendToAll(ws, msg); return; }
      case 'join' :  { ws.server = msg.url, ws.name = (msg.name || 'Unnamed') + '#' + Math.random().toString(16).substr(11); return; }
    }
  });
});

let last = 0;
function sendToAll(ws, data)
{
  if (!data.message) return;
//  if (0 - (last - (last=Date.now())) >= 100) return ws.send(JSON.stringify({
//    type: 'RATELIMITED',
//    data: 'Please try again. you have been ratelimited'
//  }))
  const client = Array.from(wss.clients);
  for (let i = 0; i < client.length; i++)
  {
    if ((client[i].readyState === WebSocket.OPEN) && (client[i].server === ws.server)) client[i].send(JSON.stringify({
      type: 'message',
      data: data.message+'',
      from: ws.name
    }));
  }
}

function login(ws, credentials) {
  console.log('sign in attempt');
  const { username, password } = credentials;
  const cred = creds[username];
  if (!cred) return ws.close();
  if (password === cred.password) {
    console.log('successful sign in');
    ws.send(cred.token);
  }
}
function signup(ws, credentials, ip) {
  if (creds[credentials.username]) return;
  console.log('new user');
  console.log(credentials);
  creds[credentials.username] = {};
  creds[credentials.username]['password'] = credentials.password;
  creds[credentials.username]['token'] = (Math.random()* +ip.split('.')[3]).toString(16).substr(2);
  fs.writeFileSync('./creds.json', JSON.stringify(creds, null, 2));
}
