const config = require('./config');
const fs = require('fs');
const net = require('net');

const SERVER_PORT = config.SERVER_PORT;

const server = net.createServer();

server.on('connection', (socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`new client connection ${remoteAddress}`);

  let ostream = fs.createWriteStream("./receiver/test2.png");
  socket.on('data', chunk => {
    console.log(chunk)
    ostream.write(chunk);
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