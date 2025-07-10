// src/sockets/pubsub.js
const { subscriber } = require('../config/redis-config');
const { getIO } = require('./socket-store'); // we will make this

function initPubSub() {
  subscriber.subscribe('notifications', () => {
    console.log('✅ Subscribed to Redis notifications channel');
  });

  subscriber.on('message', (channel, message) => {
    if (channel === 'notifications') {
      const payload = JSON.parse(message);
      const io = getIO();

      const { receiverId, type, data } = payload;

      io.to(receiverId).emit(type, data);
      console.log(`📢 Delivered '${type}' to user ${receiverId}`);
    }
  });
}

module.exports = { initPubSub };
