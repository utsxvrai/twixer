const { ServerConfig } = require('../config');
const { subscriber } = require('../config/redis-config');
const socketIO = require('socket.io');

let ioInstance = null;

function initSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: ServerConfig.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  ioInstance = io;

  // ✅ Redis Pub/Sub listener
  subscriber.subscribe('notifications');
subscriber.on('message', (channel, message) => {
  if (channel === 'notifications') {
    const data = JSON.parse(message);
    // data: { type, targetUserId, payload }
    io.to(data.targetUserId).emit(`${data.type}_notification`, data.payload);
  }
});

  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    socket.on('register', (userId) => {
      socket.join(userId); // ✅ this replaces in-memory mapping
      console.log(`✅ User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  console.log('✅ Socket.IO and Redis PubSub setup complete');
}

module.exports = {
  initSocket
};
