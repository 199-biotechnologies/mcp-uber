#!/usr/bin/env node
/**
 * Simple OAuth callback server for testing Uber MCP integration
 * 
 * Usage:
 * 1. Install dependencies: npm install express axios dotenv
 * 2. Run: node oauth-server.js
 * 3. Server will listen on http://localhost:3000/callback
 */

import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.OAUTH_SERVER_PORT || 3000;

// OAuth callback endpoint
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    // Exchange code for token
    const tokenResponse = await axios.post('https://auth.uber.com/oauth/v2/token', {
      client_id: process.env.UBER_CLIENT_ID,
      client_secret: process.env.UBER_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.UBER_REDIRECT_URI || `http://localhost:${PORT}/callback`,
      code,
    });

    const { access_token, token_type, expires_in, scope } = tokenResponse.data;

    // Return a nice HTML page with the token
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Uber OAuth Success</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #000; }
          .token-box {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            word-break: break-all;
            margin: 20px 0;
          }
          .info { color: #666; margin: 10px 0; }
          .success { color: #28a745; }
          code {
            background: #e9ecef;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="success">✅ Authorization Successful!</h1>
          
          <div class="info">
            <strong>User ID (from state):</strong> <code>${state || 'Not provided'}</code>
          </div>
          
          <div class="info">
            <strong>Token Type:</strong> <code>${token_type}</code>
          </div>
          
          <div class="info">
            <strong>Expires In:</strong> <code>${expires_in} seconds</code>
          </div>
          
          <div class="info">
            <strong>Scopes:</strong> <code>${scope}</code>
          </div>
          
          <h3>Access Token:</h3>
          <div class="token-box">${access_token}</div>
          
          <h3>Next Steps:</h3>
          <ol>
            <li>Copy the access token above</li>
            <li>In Claude, use the <code>uber_set_access_token</code> tool with:
              <pre>{
  "userId": "${state || 'your-user-id'}",
  "accessToken": "&lt;paste-token-here&gt;"
}</pre>
            </li>
            <li>You can now use other Uber MCP tools!</li>
          </ol>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OAuth Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
          }
          .error {
            background: #f8d7da;
            color: #721c24;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #f5c6cb;
          }
          pre {
            background: #f0f0f0;
            padding: 10px;
            border-radius: 3px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <div class="error">
          <h2>❌ Failed to exchange code for token</h2>
          <p>${error.response?.data?.error || error.message}</p>
          ${error.response?.data ? `<pre>${JSON.stringify(error.response.data, null, 2)}</pre>` : ''}
        </div>
      </body>
      </html>
    `);
  }
});

// Home route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>MCP Uber OAuth Server</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
        }
        code {
          background: #e9ecef;
          padding: 2px 5px;
          border-radius: 3px;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <h1>MCP Uber OAuth Callback Server</h1>
      <p>This server is running to handle OAuth callbacks from Uber.</p>
      <p>Callback URL: <code>http://localhost:${PORT}/callback</code></p>
      <p>Make sure this URL is registered in your Uber app settings.</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n🚀 OAuth callback server running at http://localhost:${PORT}`);
  console.log(`📍 Callback URL: http://localhost:${PORT}/callback`);
  console.log('\nMake sure this URL is registered in your Uber app settings!\n');
});