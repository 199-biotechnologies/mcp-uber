export interface UberConfig {
  clientId: string;
  clientSecret: string;
  serverToken?: string;
  redirectUri: string;
  apiBaseUrl: string;
  authBaseUrl: string;
  environment: 'sandbox' | 'production';
}

export interface UberToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface PriceEstimate {
  product_id: string;
  currency_code: string;
  display_name: string;
  estimate: string;
  low_estimate: number;
  high_estimate: number;
  distance: number;
  duration: number;
  surge_multiplier: number;
}

export interface RideRequest {
  request_id: string;
  status: string;
  driver?: any;
  eta?: number;
  location?: Location;
  vehicle?: any;
  pickup: Location;
  destination: Location;
}