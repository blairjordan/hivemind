const express = require("express")
const http = require("http")
const cors = require("cors")
const socketIo = require("socket.io")
const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "password",
  port: 5432,
})

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("New client connected")

  socket.on("sendSignal", async (signal) => {
    try {
      const { from, to, type, strength } = signal
      await pool.query(
        "INSERT INTO signals (from_entity_id, to_entity_id, type, strength) VALUES ($1, $2, $3, $4)",
        [from, to, type, strength]
      )
      console.log("Signal saved:", signal)
    } catch (err) {
      console.error("Error saving signal:", err)
    }
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

server.listen(3000, () => {
  console.log("Listening on *:3000")
})
