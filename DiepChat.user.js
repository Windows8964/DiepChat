// ==UserScript==
// @name         Diep Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Talk to other DiepChat users in the same server!
// @author       You
// @match        *://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// ==/UserScript==

const VPS_URL = 'wss://crabby.ciphercoded.com/diepchat';
unsafeWindow.chatHost = new WebSocket(VPS_URL);
WebSocket.prototype.hook = WebSocket.prototype.send;
WebSocket.prototype.send = function (msg) {
    if (this.url !== VPS_URL) unsafeWindow.url = this.url;
    this.hook(msg);
}
unsafeWindow.chatHost.onmessage = ({ data }) => {
    data = JSON.parse(data);
    if (data.type === 'message') alert(`${data.from} just sent: ${data.data}`)
}
document.addEventListener('keydown', ({ code }) => {
    if (code === 'Enter') return unsafeWindow.chatHost.send(JSON.stringify({ type: 'join' , server: unsafeWindow.url, name: unsafeWindow.textInput.value}));
    if (code === 'KeyV') return unsafeWindow.chatHost.send(JSON.stringify({ type: 'message', message: prompt('What would you like to say?') }))
;})
