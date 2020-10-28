const config = require('./config');
const fs = require('fs');
const net = require('net');

const SERVER_PORT = config.SERVER_PORT;

const socket = net.connect({ port: SERVER_PORT });
socket.setEncoding('utf8');

socket.on('connect', () => {
  console.log(`Connected to ${SERVER_PORT}`);

  const istream = fs.createReadStream("./test.png");
  socket.pipe(process.stdout);
  istream.on("readable", function () {
    let data;
    while (data = this.read()) {
      socket.write(data);
    }
  })

  istream.on("end", function () {
    socket.end();
  })

  socket.on("end", () => {
    console.log("\nTransfer is done!");
  })
});

socket.on("error", (err) => {
  console.log("Error", err);
});