# Testing the MCP Uber Server

## Setup

1. Get Uber API credentials from https://developer.uber.com/
2. Copy `.env.example` to `.env` and fill in your credentials
3. Build the project: `npm run build`
4. In another terminal, run the OAuth callback server: `npm run oauth-server`

## Test Flow

### 1. Get Authorization URL

Use the `uber_get_auth_url` tool with a user ID:
```json
{
  "userId": "test-user-123"
}
```

### 2. Authorize in Browser

Visit the returned URL and authorize the app. You'll be redirected to the callback server.

### 3. Set Access Token

Use the `uber_set_access_token` tool with the token from the callback:
```json
{
  "userId": "test-user-123",
  "accessToken": "YOUR_ACCESS_TOKEN_HERE"
}
```

### 4. Get Price Estimates

Use the `uber_get_price_estimates` tool:
```json
{
  "userId": "test-user-123",
  "startLatitude": 37.7749,
  "startLongitude": -122.4194,
  "endLatitude": 37.7849,
  "endLongitude": -122.4094
}
```

### 5. Request a Ride

Use the `uber_request_ride` tool with a product ID from the price estimates:
```json
{
  "userId": "test-user-123",
  "productId": "PRODUCT_ID_FROM_ESTIMATES",
  "startLatitude": 37.7749,
  "startLongitude": -122.4194,
  "endLatitude": 37.7849,
  "endLongitude": -122.4094
}
```

### 6. Check Ride Status

Use the `uber_get_ride_status` tool:
```json
{
  "userId": "test-user-123",
  "requestId": "REQUEST_ID_FROM_RIDE_REQUEST"
}
```

### 7. Cancel Ride (if needed)

Use the `uber_cancel_ride` tool:
```json
{
  "userId": "test-user-123",
  "requestId": "REQUEST_ID_FROM_RIDE_REQUEST"
}
```