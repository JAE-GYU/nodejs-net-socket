exports.createHandler = (method) => {
  return new Handler(method);
}

function Handler(method) {
  this.process = (...args) => {
    params = null;
    return method.apply(this, args);
  }
}