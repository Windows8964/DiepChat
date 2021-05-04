// ==UserScript==
// @name         Diep Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Talk to other DiepChat users in the same server!
// @author       Crabby
// @match        *://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// ==/UserScript==

const VPS_URL = 'wss://crabby.ciphercoded.com/diepchat';
const m28ServerRegex = /^wss?:\/\/[a-z0-9]{4,}\.s\.m28n\.net\/$/g;

const chatHost = unsafeWindow.chatHost = new WebSocket(VPS_URL);

const _send = WebSocket.prototype.send;
unsafeWindow.WebSocket.prototype.send = function (buffer) {
    if (m28ServerRegex.test(this.url)) unsafeWindow.url = this.url;
    
    _send.call(this, buffer);
}
chatHost.onmessage = ({ data }) => {
    data = JSON.parse(data);
    
    if (data.type === 'message') alert(`${data.from} just sent: ${data.data}`);
}
document.addEventListener('keydown', ({ code }) => {
    if (code === 'Enter') return chatHost.send(JSON.stringify({ type: 'join' , server: unsafeWindow.url, name: unsafeWindow.textInput.value}));
    if (code === 'KeyV') {
        let msg = prompt('What would you like to say?');
        if (!msg) return alert('Cancelled');
        
        return chatHost.send(JSON.stringify({ type: 'message', message: msg.slice(0, 1000) }))
    }
;})
