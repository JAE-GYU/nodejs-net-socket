const config = require('./config');
const utils = require('./utils');
const fs = require('fs');
const net = require('net');

const SERVER_PORT = config.SERVER_PORT;

const server = net.createServer();

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`new client connection ${remoteAddress}`);

  let fileName = "";
  let fileSize = 0;
  let buf = [];

  socket.on('data', chunk => {
    buf.push(chunk);
  });
  socket.on("end", () => {
    buf = buf.join("").split("\n");

    // 파일 이름 규칙
    // yyyymmdd_사용자ID_randomID(5).ua
    fileName = buf[0].split(".");
    fileName.pop();
    fileName = `${fileName.join(".")}_${utils.makeid(5)}.ua`;
    fileSize = +buf[1];

    // 파일 컨텐츠 처리 
    oFile = buf.splice(2).join("\n");
    let ostream = fs.createWriteStream(config.RECEIVE_DIR + fileName);
    for (i = 0; i < oFile.length; i++) {
      ostream.write(oFile[i]);
    }

    console.log(`File Name: '${fileName}' Done.`);
    console.log("Connection End");
  });

  socket.on("error", (err) => {
    console.log(`Error from ${remoteAddress}`, err);
  });
});

server.on("error", (err) => {
  console.log(err)
});

server.listen(3000, () => {
  console.log(`Server listening ${SERVER_PORT}`);
});