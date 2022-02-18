/**
 * Express not found handler
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * returns a status message of 404, path not found
 */
function notFound(req, res, next) {
  next({
    status: 404,
    message: `Path not found: ${req.originalUrl}`
  });
}

module.exports = notFound;
