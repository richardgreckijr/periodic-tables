/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * Returns a status message of 405; Bad request
 */
function methodNotAllowed(req, res, next) {
    next({
        status: 405,
        message: `${req.method} not allowed for ${req.originalUrl}`,
    });
}

module.exports = methodNotAllowed;
