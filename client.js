const config = require('./config');
const fs = require('fs');
const net = require('net');

const SERVER_PORT = config.SERVER_PORT;

const socket = net.connect({ port: SERVER_PORT });
socket.setEncoding('utf8');

socket.on('connect', () => {
  console.log(`Connected to ${SERVER_PORT}`);

  const istream = fs.createReadStream("./test.png");

  // fileName과 fileSize가 붙어서 가는 경우가 있어서 콜백으로 처리함;;
  // 좋은 방법 생기면 다시 처리
  let fileNameBuffer = Buffer.from("test.png");
  socket.write(fileNameBuffer, () => {
    let fileSize = Buffer.from("20");
    socket.write(fileSize, () => {
      socket.pipe(process.stdout);

      istream.on("readable", () => {
        let data;
        while (data = istream.read()) {
          socket.write(data);
        }
      })

      istream.on("end", () => {
        socket.end();
      })

    });
  });
});

socket.on("end", () => {
  console.log("\nTransfer is done!");
})

socket.on("error", (err) => {
  console.log("Error", err);
});