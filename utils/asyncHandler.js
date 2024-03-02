const asyncHandler = (fn) => async(req, res, next) =>{
    try {
        await fn(req, res, next);
    } catch (error) {

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'An unknown error occurred'
        });
    }
}
module.exports = asyncHandler;