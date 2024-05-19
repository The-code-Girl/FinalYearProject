const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Mongo Connection */
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connected!");
});

/* Routes */
const chatRouter = require("./routes/chat");
const courseRouter = require("./routes/course");
const userRouter = require("./routes/user");

app.use("/api/chat", chatRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

/* Frontend Static files */
app.use(express.static(path.join(__dirname, "frontend", "dist", "uimpactify-app")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "uimpactify-app", "index.html"));
});

/* Express Server */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

/* Socket.io Connection */
const io = require("socket.io")(server);
require("./routes/chat").listen(io);

