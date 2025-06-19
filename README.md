# MCP Uber Server

An MCP (Model Context Protocol) server for booking Uber rides through AI assistants.

<a href="https://glama.ai/mcp/servers/@199-biotechnologies/mcp-uber">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@199-biotechnologies/mcp-uber/badge" alt="Uber Server MCP server" />
</a>

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

### Step 1: Create an Uber Developer Account

1. Go to [Uber Developer Dashboard](https://developer.uber.com/)
2. Click "Sign in" and either:
   - Use an existing Uber rider/driver account
   - Create a new account specifically for development
   
**💡 Tip:** For organizations, create an email alias (e.g., dev@yourcompany.com) instead of using a personal account for easier ownership transfer.

### Step 2: Create a New App

1. In the [Developer Dashboard](https://developer.uber.com/dashboard), click "Create App" (top right corner)
2. Fill in the required information:
   - **App Name**: Your application name
   - **Description**: Brief description of what your app does
3. Click "Create"

### Step 3: Get Your API Credentials

1. Navigate to your app in the dashboard
2. Go to the **Auth** tab
3. You'll find:
   - **Client ID**: Public identifier for your app
   - **Client Secret**: Private key (keep this secure!)
   - **Server Token**: For server-side requests

### Step 4: Configure OAuth Settings

1. In the **Auth** tab, add your redirect URI:
   - For local testing: `http://localhost:3000/callback`
   - For production: Your actual callback URL
2. Select required scopes:
   - `profile` - User's basic profile information
   - `request` - Request rides on user's behalf
   - `ride_request` - View and manage active ride requests

**⚠️ Note:** The `request` scope is privileged and requires Uber approval for production use. During development, your account can use it without approval.

### Step 5: Set Up Environment Variables

Create environment variables with your credentials (see Configuration section below)

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

## Testing Your Integration

1. **Use sandbox mode** for testing:
   - Set `UBER_ENVIRONMENT=sandbox` in your environment
   - Sandbox mode simulates ride requests without real drivers
   - Perfect for development and testing

2. **Test the OAuth flow**:
   - Use the `uber_get_auth_url` tool to get an authorization URL
   - Visit the URL and authorize your app
   - After authorization, Uber will redirect to your callback URL with a code
   - Exchange the code for an access token (you'll need to set up your own callback handler)
   - Use `uber_set_access_token` to store the token in the MCP server

3. **Setting up a callback handler**:
   - For testing, you can use a simple Express server (see `examples/oauth-server.js` in the [GitHub repo](https://github.com/199-biotechnologies/mcp-uber))
   - For production, implement a secure callback handler in your application
   - The callback URL must match exactly what's configured in your Uber app

## Important Notes

### Sandbox vs Production

- **Sandbox Mode** (default):
  - Simulated rides and drivers
  - No real charges
  - Perfect for testing
  - Limited to your developer account

- **Production Mode**:
  - Real rides and charges
  - Requires Uber approval for privileged scopes
  - Must pass Uber's review process

### Security Best Practices

1. **Never commit credentials**: Keep your Client Secret secure
2. **Use environment variables**: Don't hardcode credentials
3. **Implement proper token storage**: The current in-memory storage is for demo only
4. **Validate redirect URIs**: Ensure your callback URLs are properly configured

### API Limitations

- Rate limits apply (check Uber's documentation)
- Privileged scopes require approval for production use
- Sandbox mode has some limitations compared to production

### Troubleshooting

- **"Invalid scope" error**: Your app needs approval for privileged scopes in production
- **"Invalid redirect URI"**: Make sure your redirect URI exactly matches what's configured in the Uber dashboard
- **"Unauthorized" errors**: Check that your access token is valid and not expired

## Resources

- [Uber API Documentation](https://developer.uber.com/docs)
- [OAuth 2.0 Guide](https://developer.uber.com/docs/riders/ride-requests/tutorials/api/introduction-oauth)
- [Sandbox Testing Guide](https://developer.uber.com/docs/riders/ride-requests/tutorials/api/sandbox)
- [API Status Page](https://status.uber.com/)