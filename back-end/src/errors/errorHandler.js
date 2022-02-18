/**
 * 
 * @param {*} error 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * Sets and returns an error status message of 500
 */
function errorHandler(error, request, response, next) {
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
}

module.exports = errorHandler;
