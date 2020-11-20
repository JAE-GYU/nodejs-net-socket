const handlerFactory = require('./handler');

const handlers = {};

exports.clear = () => {
  handlers = {};
}

exports.register = (command, method) => {
  handlers[command] = { handler: handlerFactory.createHandler(method) };
}

exports.route = (command) => {
  const handler = handlers[command] ? handlers[command].handler : null;

  return handler;
}
