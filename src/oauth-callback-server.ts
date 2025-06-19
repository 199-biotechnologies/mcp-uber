import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

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
      redirect_uri: process.env.UBER_REDIRECT_URI,
      code,
    });

    const { access_token } = tokenResponse.data;

    // In a real app, you'd store this token securely
    res.send(`
      <html>
        <body>
          <h1>Authorization Successful!</h1>
          <p>Access Token: <code>${access_token}</code></p>
          <p>User ID (from state): <code>${state}</code></p>
          <p>Use the MCP tool 'uber_set_access_token' with this token to continue.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).send('Failed to exchange code for token');
  }
});

app.listen(PORT, () => {
  console.log(`OAuth callback server running at http://localhost:${PORT}`);
  console.log(`Callback URL: http://localhost:${PORT}/callback`);
});