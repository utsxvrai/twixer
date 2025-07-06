const CrudRepository = require('./crud-repository');
const Tweet = require('../models/tweet');


class TweetRepository extends CrudRepository {
    constructor() {
        super(Tweet);
    }

    async getTweetsByUser(userId) {
        return await Tweet.find({ author: userId }).sort({ createdAt: -1 }).populate('author', 'username name profilePicture');
    }
}

module.exports = TweetRepository;