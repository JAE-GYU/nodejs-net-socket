const fs = require('fs');
const net = require('net');
const router = require('./socket-command-router');
const constants = require('./constants');

router.register(constants.COMMAND.REQUEST_RULE, (socket, handler, chunkHeader, chunkData) => {
  let fileSize = null;
  let policyFilePath = appRoot + config.POLICY_FILE_PATH + config.POLICY_FILE_NAME;

  try {
    fs.stat(policyFilePath, (err, data) => {
      fileSize = data.size;

      socket.write(`${JSON.stringify({
        ...chunkHeader,
        param: {
          fileName: config.POLICY_FILE_NAME,
          fileSize: fileSize
        }
      })}\n`, 'utf8', () => {
        const istream = fs.createReadStream(policyFilePath);

        socket.pipe(process.stdout);

        istream.on("readable", () => {
          let data;
          while (data = istream.read()) {
            let currSize = data.length
            socket.write(data, 'utf8', () => {
              if (currSize >= fileSize) {
                socket.end();
              }
            });
          }
        })
      })
    });
  } catch (err) {
    socket.write(JSON.stringify({
      ...chunkHeader,
      status: 0,
      message: err
    }));
    socket.end();
  }
});

router.register(constants.COMMAND.STORE_FILE, (socket, handler, chunkHeader, chunkData) => {
  let fileName = chunkHeader.param.fileName;

  // 파일 컨텐츠 처리 
  const ostream = fs.createWriteStream(appRoot + config.RECEIVE_DIR + fileName);
  for (i = 0; i < chunkData.length; i++) {
    ostream.write(chunkData[i]);
  }

  console.log(`File name: '${fileName}' done`);
});

function processData(socket, handler, chunkHeader, chunkData) {
  handler.process(socket, handler, chunkHeader, chunkData)
}

module.exports = (config) => {
  const server = net.createServer();

  server.on('connection', (socket) => {
    const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`New client connection ${remoteAddress}`);

    const buf = [];
    let init = false;

    let handler = null;
    let chunkHeader = null;
    let chunkData = null;

    socket.on('data', (chunk) => {
      buf.push(chunk);
      if (!init) {
        chunkHeader = JSON.parse(buf[0]);
        console.log("COMMAND:", chunkHeader.command);
        handler = router.route(chunkHeader.command);

        if (!handler) {
          socket.write(JSON.stringify({
            ...chunkHeader,
            status: 0,
            message: "Command not found"
          }));
          socket.end();
        }

        if (chunkHeader.noData) {
          processData(socket, handler, chunkHeader);
        }
      }
    });

    socket.on("end", () => {
      if (handler && !chunkHeader.noData) {
        // 변경 전: 
        // 1> fileName
        // 2> fileSize
        // 3> ...data

        // 변경 후:
        // 1> { command: constants.COMMAND.REQUEST_RULE, param: { [fileName], [fileSize] } }
        // 2> ...data

        //  리턴 값
        /// command와 param 그대로 보내주고 status와 message 추가
        //  1> { 
        //       command: constants.COMMAND.REQUEST_RULE, 
        //       param: { [fileName], [fileSize] },
        //       status: 0,   0 에러, 1 성공, 2 경고
        //       message: "에러"
        //     } 

        const chunks = buf.join("").split("\n");
        chunkData = chunks.splice(1).join("\n");

        processData(socket, handler, chunkHeader, chunkData)
      }

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