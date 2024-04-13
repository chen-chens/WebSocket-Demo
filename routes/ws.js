const { WebSocketServer } = require("ws");
const { v4 } = require('uuid');


const wss1 = new WebSocketServer({ noServer: true });

wss1.on("connection", () => {
    wss1.on("error", () => {
        console.log("-- WebSocket Server 連線失敗！ --");
    });
    console.log("-- WebSocket Server 連線成功！ --");
});

module.exports = wss1;