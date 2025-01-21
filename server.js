const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const impemailRoutes = require("./routes/impemailRoute");

const http = require("http");
const socketIo = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server to integrate with socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Allow only the frontend domain
    credentials: true, // Allow sending credentials (cookies, authorization headers, etc.)
  },
});

const corsOptions = {
  origin: "http://localhost:5173", // Allow only the frontend domain
  credentials: true, // Allow sending credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/mail", impemailRoutes);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle any events from the client here (for example, messaging)
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
