const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage });

// Main API routes
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Buyer Portal API is running...');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
    // Notify other devices (Desktop) in the room that mobile has joined
    socket.to(roomId).emit('device-joined');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.post('/api/upload', upload.array('images'), (req, res) => {
  const roomId = req.body.roomId;
  if (!roomId) {
    return res.status(400).json({ error: 'roomId is required' });
  }

  const protocol = req.protocol;
  const host = req.get('host');
  const imageUrls = req.files.map(f => `${protocol}://${host}/uploads/${f.filename}`);

  // Emit to socket room
  io.to(roomId).emit('receive-images', imageUrls);

  res.json({ success: true, urls: imageUrls });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
