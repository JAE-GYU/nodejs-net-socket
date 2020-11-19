const config = require('./config')
const SocketModule = require('./src/modules/socket-module');
const HttpModule = require('./src/modules/http-module');

SocketModule(config);
HttpModule(config);