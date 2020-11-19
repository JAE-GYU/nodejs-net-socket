const fs = require('fs');
const net = require('net');

module.exports = (config) => {
  const server = net.createServer();

  server.on('connection', (socket) => {
    const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`New client connection ${remoteAddress}`);


    const buf = [];

    socket.on('data', (chunk) => {
      buf.push(chunk);
    });

    socket.on("end", () => {
      const joinBuf = buf.join("").split("\n");

      fileName = joinBuf[0];
      fileSize = +joinBuf[1];

      // 파일 컨텐츠 처리 
      const oFile = joinBuf.splice(2).join("\n");
      const ostream = fs.createWriteStream(config.RECEIVE_DIR + fileName);
      for (i = 0; i < oFile.length; i++) {
        ostream.write(oFile[i]);
      }

      console.log(`File name: '${fileName}' done`);
      console.log("Connection end");
    });

    socket.on("error", (error) => {
      console.log(`Error from ${remoteAddress}`, error);
    });
  });

  server.on("error", (error) => {
    console.error(error)
  });

  server.listen(config.SOCKET_PORT, () => {
    console.log(`Socket server listening ${config.SOCKET_PORT}`);
  });
}