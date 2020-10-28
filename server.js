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
    fileName = buf[0];
    fileSize = +buf[1];

    oFile = buf.splice(2).join("\n");
    let ostream = fs.createWriteStream(config.RECEIVE_DIR + fileName);
    for (i = 0; i < oFile.length; i++) {
      ostream.write(oFile[i]);
    }

    console.log("Connection End")
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