exports.createHandler = (method) => {
  return new Handler(method);
}

function Handler(method) {
  this.process = (request, response) => {
    params = null;
    return method.apply(this, [request, response, params]);
  }
}