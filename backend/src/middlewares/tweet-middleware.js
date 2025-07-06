const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

function validateTweetRequest(req, res, next) {
    const MAX_TWEET_LENGTH = 280;
    if (!req.body.content || typeof req.body.content !== 'string' || req.body.content.trim() === '') {
        ErrorResponse.message = 'Invalid tweet content';
        ErrorResponse.error = new AppError(['Tweet content is required and must be a non-empty string'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if (req.body.content.length > MAX_TWEET_LENGTH) {
        ErrorResponse.message = 'Tweet content too long';
        ErrorResponse.error = new AppError([`Tweet content must not exceed ${MAX_TWEET_LENGTH} characters`], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

module.exports = {
    validateTweetRequest
};