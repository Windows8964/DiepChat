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
WebSocket.prototype.hook = WebSocket.prototype.send;
WebSocket.prototype.send = function (msg) {
    if (this.url !== VPS_URL) unsafeWindow.url = this.url;
    this.hook(msg);
}

unsafeWindow.chatServer = new WebSocket(VPS_URL);
document.addEventListener('keydown', e => e.code === 'Enter' ?
    unsafeWindow.chatServer.send(JSON.stringify({ type: 'join', name: unsafeWindow.textInput.value, server: unsafeWindow.url })) :
    e.code === 'KeyV' ?
    unsafeWindow.chatServer.send(JSON.stringify({ type: 'message', message: prompt('What would you like to send?', 'default')})):'');
unsafeWindow.chatServer.onmessage = msg => JSON.parse(msg.data).type === 'message'? alert(`${JSON.parse(msg.data).from} send ${JSON.parse(msg.data).data}`):'';
