const config = require('../config');
const fs = require('fs');
const net = require('net');
const constants = require('./modules/constants');

const SOCKET_PORT = config.SOCKET_PORT;

const socket = net.connect({ port: SOCKET_PORT });
socket.setEncoding('utf8');

let status = constants.STATUS.IDLE;
socket.on('connect', () => {
  console.log(`Connected to ${SOCKET_PORT}`);

  // COMMAND 1
  // const istream = fs.createReadStream("server/examples/test.txt");

  // let fileNameBuffer = Buffer.from(`{"command": 1, "param": {"fileName": "test.txt", "fileSize": 57}}\n`);
  // socket.write(fileNameBuffer);

  // socket.pipe(process.stdout);
  // istream.on("readable", () => {
  //   let data;
  //   while (data = istream.read()) {
  //     if (status === constants.STATUS.ERROR) break;
  //     socket.write(data);
  //   }
  // })

  // istream.on("end", () => {
  //   socket.end();
  // })

  // COMMAND 0
  let fileNameBuffer = Buffer.from(`{"command": 0, "param": {"fileName": "test.txt", "fileSize": 57}, "noData": true}\n`);
  socket.write(fileNameBuffer);
});

const buf = []

socket.on('data', (chunk) => {
  const msg = JSON.stringify(JSON.parse(chunk));
  console.log(msg)

  status = msg.status;
  buf.push(chunk);
});

socket.on("end", () => {
  console.log("\nTransfer is done!");
})

socket.on("error", (err) => {
  console.log("Error", err);
});