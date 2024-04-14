const WebSocket = require("ws");
const { v4: uuidv4 } = require('uuid');

const source = {
    petSitter: "保姆",
    breeder: "飼主"
}

const wss1 = new WebSocket.WebSocketServer({ noServer: true });

wss1.on("connection", (ws) => {
    ws.on("error", () => {
        console.log("-- WebSocket Server 連線失敗！ --");
    });
    console.log("-- WebSocket Server 連線成功！ --");
    const uuid = uuidv4();
    ws.uuid = uuid;
    const context = {
        uuid, // 用來辨認來源
        source: source.petSitter,
        message: "您好，我是保姆 Joanna!",
    };
    ws.send(JSON.stringify(context));

    ws.on('message', (data) => {
        console.log("Server 收到前端訊息：", JSON.parse(data));
        const receiveData = JSON.parse(data);
        // 回傳給前端自己發出的訊息：
        const newMessageFromWeb = {
            uuid, // 用來辨認來源
            source: receiveData.source,
            message: receiveData.message,
        };
        sendAllUser(newMessageFromWeb);
    })
});

const sendAllUser = (msg) => {
    wss1.clients.forEach((client) => {
        // 推播給所有人，不包含自己
        if(client.readyState === WebSocket.OPEN && client.uuid !== msg.uuid){
            client.send(JSON.stringify(msg));
        }
    });
}

module.exports = wss1;