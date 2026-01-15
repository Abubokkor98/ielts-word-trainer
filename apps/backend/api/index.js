/**
 * Vercel Serverless Function Entry Point
 *
 * This file loads the built backend from dist/apps/backend/main.js
 * The built output has all @ielts/* dependencies bundled by webpack
 */

// The built main.js is a complete Express server
// We just need to start it and export for Vercel
const { connectToDatabase } = require('../../dist/apps/backend/config/mongo');
const { createServer } = require('../../dist/apps/backend/server');

let app = null;

module.exports = async (req, res) => {
  try {
    if (!app) {
      console.log('Init app from built output');
      app = createServer();
    }

    await connectToDatabase();
    app(req, res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
