# MCP Uber Server

An MCP (Model Context Protocol) server for booking Uber rides through AI assistants.

## Features

- OAuth 2.0 authentication with Uber
- Get price estimates for rides
- Request Uber rides
- Check ride status
- Cancel rides

## Installation

### Using npm (global installation)
```bash
npm install -g mcp-uber
```

### Using npx (no installation required)
```bash
npx mcp-uber
```

## Setup

1. Get Uber API credentials:
   - Go to [Uber Developer Dashboard](https://developer.uber.com/)
   - Create a new app
   - Copy your Client ID and Client Secret

2. Set up environment variables (see Configuration section below)

## Usage with Claude Desktop

### Using npm (global installation)
Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "uber": {
      "command": "mcp-uber",
      "env": {
        "UBER_CLIENT_ID": "your_client_id",
        "UBER_CLIENT_SECRET": "your_client_secret",
        "UBER_REDIRECT_URI": "http://localhost:3000/callback",
        "UBER_ENVIRONMENT": "sandbox"
      }
    }
  }
}
```

### Using npx
Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "uber": {
      "command": "npx",
      "args": ["mcp-uber"],
      "env": {
        "UBER_CLIENT_ID": "your_client_id",
        "UBER_CLIENT_SECRET": "your_client_secret",
        "UBER_REDIRECT_URI": "http://localhost:3000/callback",
        "UBER_ENVIRONMENT": "sandbox"
      }
    }
  }
}
```

## Available Tools

1. **uber_get_auth_url** - Get OAuth authorization URL
2. **uber_set_access_token** - Set user's access token
3. **uber_get_price_estimates** - Get price estimates for a ride
4. **uber_request_ride** - Request an Uber ride
5. **uber_get_ride_status** - Check ride request status
6. **uber_cancel_ride** - Cancel a ride request

## OAuth Flow

1. Use `uber_get_auth_url` to get the authorization URL
2. User visits the URL and authorizes your app
3. After callback, exchange the code for an access token
4. Use `uber_set_access_token` to store the token
5. Now you can make API calls

## Configuration

### Environment Variables

The MCP server requires the following environment variables:

- `UBER_CLIENT_ID`: Your Uber app client ID
- `UBER_CLIENT_SECRET`: Your Uber app client secret  
- `UBER_REDIRECT_URI`: OAuth callback URL (default: `http://localhost:3000/callback`)
- `UBER_ENVIRONMENT`: Either `sandbox` or `production` (default: `sandbox`)

## Notes

- This server uses the Uber API sandbox by default
- In production, implement proper token storage (not in-memory)
- Ensure your redirect URI is registered in your Uber app settings