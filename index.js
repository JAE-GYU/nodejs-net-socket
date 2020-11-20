const path = require('path');

const SocketModule = require('./src/modules/socket-module');
const HttpModule = require('./src/modules/http-module');

global.appRoot = path.resolve(__dirname);
global.config = require('./config')

SocketModule(config);
HttpModule(config);