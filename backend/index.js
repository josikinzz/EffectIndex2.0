const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Messages = require('./messages.js');

const express = require("express");

const mongoose = require("mongoose");
const cors = require('cors'); // Import CORS
const { mongooseUri, browseOnlyMode } = require('./config');

// Prevent query buffering from hanging requests when MongoDB is unavailable.
mongoose.set('bufferCommands', false);

const api = require("./models/");

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

const firstRun = require("./models/firstRun");

app.set("port", port);

const corsOptions = {
  origin: ['https://www.effectindex.com', 'https://my.tripp.report', 'https://effectindex.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

const mongooseStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

const isPath = (path, base) => path === base || path.startsWith(`${base}/`);
const browseOnlyFallbackForPath = (path = '') => {
  if (isPath(path, '/effects')) {
    return path === '/effects' ? { effects: [] } : { effect: null };
  }

  if (isPath(path, '/articles')) {
    return path === '/articles' ? { articles: [] } : { article: null };
  }

  if (isPath(path, '/blog')) {
    return path === '/blog' ? { posts: [] } : { post: null };
  }

  if (isPath(path, '/reports')) {
    if (path === '/reports' || path === '/reports/admin') return { reports: [] };
    return { report: null };
  }

  if (path === '/replications' || path === '/replications/featured' || path === '/replications/audio' || path.startsWith('/replications/byartist/')) {
    return { replications: [] };
  }

  if (path === '/replications/gallery') {
    return { replications: [], replicated_effects: [] };
  }

  if (isPath(path, '/replications')) {
    return { replication: null };
  }

  if (path === '/persons' || path === '/persons/featured' || path === '/persons/all') {
    return { people: [] };
  }

  if (path === '/persons/me') {
    return { person: null };
  }

  if (isPath(path, '/persons')) {
    return { person: null };
  }

  if (path === '/profiles') {
    return { profiles: [] };
  }

  if (isPath(path, '/profiles')) {
    return { profile: null };
  }

  if (path === '/redirects') {
    return { redirects: [] };
  }

  return null;
};

app.use(cors(corsOptions));
// Import API Routes
app.use(express.json({ limit: "1mb" }));
app.get('/api/health', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const isConnected = readyState === 1;

  return res.status(isConnected ? 200 : 503).json({
    ok: isConnected,
    mongo: {
      readyState,
      state: mongooseStates[readyState] || 'unknown'
    }
  });
});

app.use('/api', (req, res, next) => {
  if (!browseOnlyMode) return next();

  const readMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
  if (readMethods.has(req.method)) return next();

  return res.status(405).json({
    error: {
      name: 'READ_ONLY_MODE',
      message: 'This API is running in browse-only mode and does not accept write operations.'
    }
  });
});

let startupPromise = Promise.resolve();

app.use('/api', async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 3) {
    await startupPromise.catch(() => {});
  }

  if (mongoose.connection.readyState !== 1) {
    const fallback = browseOnlyMode ? browseOnlyFallbackForPath(req.path) : null;
    if (fallback) {
      return res.status(200).json(fallback);
    }

    return res.status(503).json({
      error: {
        name: 'DATABASE_UNAVAILABLE',
        message: 'MongoDB is not connected. Start MongoDB and retry.'
      }
    });
  }

  next();
}, api);

const isDev = process.env.NODE_ENV !== "production";
const mongoServerSelectionTimeoutMs = Number(process.env.MONGOOSE_SERVER_SELECTION_TIMEOUT_MS || 5000);

const message = new Messages();

async function start() {
  message.preconnect;
  try {
    const connection = await mongoose.connect(mongooseUri, {
      serverSelectionTimeoutMS: mongoServerSelectionTimeoutMs
    });

    if (isDev) message.logo;
    message.connected(connection.connections[0].name);
    if (!browseOnlyMode) {
      await firstRun();
    }
    message.up(host, port);
  } catch (error) {
    message.error;
    console.error(`[backend] Failed to connect to MongoDB (${mongooseUri}): ${error.message}`);

    if (!isDev) process.exit(1);
  }
}

startupPromise = start();

app.shutdown = async () => {
  if (mongoose.connection.readyState === 0) return;
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error(`[backend] Failed to close MongoDB connection cleanly: ${error.message}`);
  }
};

module.exports = app;
