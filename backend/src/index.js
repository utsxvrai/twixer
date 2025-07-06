const express = require("express");
const { ServerConfig , Logger} = require('./config');
const connectDB = require('./config/db-config');
const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();

const app = express();
const apiRoutes = require('./routes');

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:4000'
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/index.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  app.use(express.json());
  app.use('/api', apiRoutes);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger-output.json')));
  connectDB();
  app.listen(ServerConfig.PORT, () => {
    console.log(`Listening on port ${ServerConfig.PORT}`);
    Logger.info("Successfully started the Server", {});
  });
});