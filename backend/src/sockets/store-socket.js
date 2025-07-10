let ioInstance = null;

function storeIOInstance(io) {
  ioInstance = io;
}

function getIO() {
  return ioInstance;
}

module.exports = { storeIOInstance, getIO };
