const asyncHandler = (fn) => async(req, res, next) =>{
    try {
        await fn(req, res, next);
    } catch (error) {
        res.staus(err.code || 500).json({
            success: false,
            message: error.message || 'An unknown error occurred'
        });
    }
}