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

const signals = ["love", "think", "joy", "sadness"]

io.on("connection", (socket) => {
  console.log("🖥️ new client connected")

  socket.on("sendSignal", async (signal) => {
    try {
      const { from, to, type, strength } = signal
      await pool.query(
        "INSERT INTO signals (from_entity_id, to_entity_id, type, strength) VALUES ($1, $2, $3, $4)",
        [from, to, type, strength]
      )
      console.log("💾 saved signal", signal)
    } catch (err) {
      console.error("error saving signal:", err)
    }
  })

  socket.on("disconnect", () => {
    console.log("client disconnected")
  })
})

const emitSignals = async () => {
  try {
    const result = signals.reduce((prev, curr) => {
      prev[curr] = []
      return prev
    }, {})

    for (const signal of signals) {
      const { rows } = await pool.query(
        `SELECT * FROM get_signals_avg_strength_1s_zeroset($1) ORDER BY bucket ASC`,
        [signal]
      )
      result[signal] = rows
    }

    io.emit("signalsUpdate", result)
  } catch (err) {
    console.error("Error fetching signal strength:", err)
  }
}

setInterval(emitSignals, 500)

server.listen(3000, () => {
  console.log("Listening on *:3000")
})
