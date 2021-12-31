module.exports = (func) => async (request, response, next) => {
  if (request.error) next();
  else {
    try {
      response.json(
        await func(request.body || {}, request.session || {}, request.params || {}),
      );
    } catch (error) {
      request.error = error;
      next();
    }
  }
};
