const {StatusCodes} = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const CrudRepository = require('./crud-repository');
const User = require('../models/user'); 


class UserRepository extends CrudRepository {
    constructor(){
        super(User);
    }
    async getUserByUsername(username) {
    try {
        const user = await User.findOne({ username });
        return user; // Return null if not found, don't throw
    } catch (error) {
        throw new AppError('Database error', 500);
    }
}
    async getUserByEmail(email) {
        try {
            const user = await this.model.findOne({ email });
            return user;
        } catch (error) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}
module.exports = UserRepository;
    
    