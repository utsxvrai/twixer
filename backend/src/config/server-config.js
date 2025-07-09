const dotenv = require('dotenv');

dotenv.config();
module.exports ={
    PORT: process.env.PORT || 3000,
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRATION || '100d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
}