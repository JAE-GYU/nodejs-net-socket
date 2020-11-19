const config = require('../config');
const fs = require('fs');
const net = require('net');

const SOCKET_PORT = config.SOCKET_PORT;

const socket = net.connect({ port: SOCKET_PORT });
socket.setEncoding('utf8');

socket.on('connect', () => {
  console.log(`Connected to ${SOCKET_PORT}`);

  const istream = fs.createReadStream("examples/test.txt");

  let fileNameBuffer = Buffer.from("20201029_gyu@inzent.com.log\n20\n");
  socket.write(fileNameBuffer);

  socket.pipe(process.stdout);
  istream.on("readable", () => {
    let data;
    while (data = istream.read()) {
      console.log(data.toString())
      socket.write(data);
    }
  })

  istream.on("end", () => {
    socket.end();
  })

});

socket.on("end", () => {
  console.log("\nTransfer is done!");
})

socket.on("error", (err) => {
  console.log("Error", err);
});