const config = require('./config');
const fs = require('fs');
const net = require('net');

const SERVER_PORT = config.SERVER_PORT;

const server = net.createServer();

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`new client connection ${remoteAddress}`);

  let ostream = null;
  let fileName = "";
  let fileSize = 0;
  let i = 0;

  socket.on('data', chunk => {
    if (i === 0) {
      fileName = chunk;
      console.log("fileName:", chunk.toString())
      ostream = fs.createWriteStream("./receiver/" + fileName);
    } else if (i === 1) {
      fileSize = +chunk;
      console.log("fileSize:" + chunk)
    } else {
      ostream.write(chunk);
    }
    i++;
  });
  socket.on("end", () => {
    console.log("Connection End")
  });

  socket.on("error", (err) => {
    console.log(`Error from ${remoteAddress}`, err);
  });
});

server.on("error", (err) => {
  throw err
});

server.listen(3000, () => {
  console.log(`Server listening ${SERVER_PORT}`);
});