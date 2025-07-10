const Redis = require('ioredis');

const redis = new Redis(); // uses default: localhost:6379

const publisher = new Redis();  // For publishing messages
const subscriber = new Redis(); // For subscribing to messages

module.exports = {
  redis,        // for caching
  publisher,    // for pub/sub
  subscriber    // for pub/sub
};
