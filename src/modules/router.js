const fs = require('fs');
const path = require("path");
const parser = require('url');
const constants = require('./constants');
const handlerFactory = require('./handler');

const handlers = {};

exports.clear = () => {
  handlers = {};
}

exports.writeStatusMessage = (request, status) => {
  request.writeHead(constants.HTTP_STATUS_MESSAGE[status].code, { 'Content-Type': 'text/plain' });
  request.write(`<h1>${constants.HTTP_STATUS_MESSAGE[status].code} ${constants.HTTP_STATUS_MESSAGE[status].message}</h1>`);
  request.end()
}

exports.register = (reqestMethods, url, method) => {
  handlers[url] = { requestMethods: reqestMethods, handler: handlerFactory.createHandler(method) };
}

exports.route = (request) => {
  url = parser.parse(request.url, true);
  let handler = handlers[url.pathname];
  if (!handler) {
    handler = this.missing(request)
  } else {
    if (!handler.requestMethods.includes(request.method)) {
      handler = handlerFactory.createHandler((req, res) => {
        this.writeStatusMessage(res, "METHOD_NOT_ALLOWED");
      });
    } else {
      handler = handler.handler
    }
  }

  return handler;
}

exports.missing = (request) => {
  let pathname = path.join(__dirname, '..', '..', 'public', url.parse(request.url).pathname)
  if (pathname.charAt(pathname.length - 1) == "/" || pathname.charAt(pathname.length - 1) == "\\") {
    pathname += 'index.html';
  }
  try {
    let data = fs.readFileSync(pathname);
    mime = request.headers.accepts || 'text/html'
    return handlerFactory.createHandler((req, res) => {
      let extName = path.extname(pathname).replace(".", "").toLowerCase();
      let mime = constants.CONTENT_TYPE[extName] || req.headers.accepts || "application/octet-stream";
      res.writeHead(200, { 'Content-Type': mime });
      res.write(data);
      res.end();
    });
  } catch (e) {
    return handlerFactory.createHandler((req, res) => {
      this.writeStatusMessage(res, "NOT_FOUND")
    });
  }
}
