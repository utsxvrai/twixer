const express = require("express");
const http = require("http");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/db-config");
const { ServerConfig, Logger } = require("./config");
const { initSocket } = require("./sockets"); // Use correct relative path
const apiRoutes = require("./routes");

const app = express();
const server = http.createServer(app); // attach app to HTTP server

// 🌍 Enable CORS
app.use(cors({
  origin: ServerConfig.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
}));

// 📦 Middleware
app.use(express.json());

// 🚏 Routes
app.use("/api", apiRoutes);

// 📘 Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(require("./swagger-output.json")));

// 🧠 Connect to DB
connectDB();

// 🔌 Socket.IO
initSocket(server); 

// 🚀 Start server
server.listen(ServerConfig.PORT, () => {
  console.log(`Server listening on port ${ServerConfig.PORT}`);
  Logger.info("Successfully started the Server", {});
});
