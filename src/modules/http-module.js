const http = require("http");
const path = require("path");
const fs = require('fs');
const router = require('./router');

router.register(["POST"], '/writePolicyFile', (request, response) => {
  let requestBody = '';
  request.on('data', (data) => {
    requestBody += data;
  });

  request.on('end', () => {
    try {
      let ostream = fs.createWriteStream(path.join(__dirname, '..', '..', 'examples', 'policy.json'));
      ostream.write(requestBody);
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end();
    } catch (err) {
      console.error(err)
      response.writeHead(400, { "Content-Type": "text/html" });
      response.end();
    }
  });
});

router.register(["GET"], '/getPolicyFile', (request, response) => {
  let data = fs.readFileSync(path.join(__dirname, '..', '..', 'examples', 'policy.json'));
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(data);
});

module.exports = (config) => {
  http.createServer((request, response) => {
    const handler = router.route(request);
    handler.process(request, response);
  })
    .listen(config.WEB_PORT, () => {
      console.log(`HTTP server listening ${config.WEB_PORT}`)
    });
}