import axios, { AxiosInstance } from 'axios';
import { UberConfig, UberToken, Location, PriceEstimate, RideRequest } from './types.js';

export class UberClient {
  private config: UberConfig;
  private api: AxiosInstance;
  private token?: UberToken;

  constructor(config: UberConfig) {
    this.config = config;
    this.api = axios.create({
      baseURL: this.config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setAccessToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async getAuthorizationUrl(state: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      scope: 'profile request ride_request',
      state,
    });
    return `${this.config.authBaseUrl}/oauth/v2/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<UberToken> {
    const response = await axios.post(`${this.config.authBaseUrl}/oauth/v2/token`, {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.config.redirectUri,
      code,
    });
    
    this.token = response.data;
    if (this.token) {
      this.setAccessToken(this.token.access_token);
    }
    return response.data;
  }

  async getPriceEstimates(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<PriceEstimate[]> {
    const response = await this.api.get('/v1.2/estimates/price', {
      params: {
        start_latitude: startLat,
        start_longitude: startLng,
        end_latitude: endLat,
        end_longitude: endLng,
      },
    });
    return response.data.prices;
  }

  async requestRide(
    productId: string,
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    fareId?: string
  ): Promise<RideRequest> {
    const payload: any = {
      product_id: productId,
      start_latitude: startLat,
      start_longitude: startLng,
      end_latitude: endLat,
      end_longitude: endLng,
    };

    if (fareId) {
      payload.fare_id = fareId;
    }

    const response = await this.api.post('/v1.2/requests', payload);
    return response.data;
  }

  async getRideStatus(requestId: string): Promise<RideRequest> {
    const response = await this.api.get(`/v1.2/requests/${requestId}`);
    return response.data;
  }

  async cancelRide(requestId: string): Promise<void> {
    await this.api.delete(`/v1.2/requests/${requestId}`);
  }

  async getProducts(latitude: number, longitude: number): Promise<any[]> {
    const response = await this.api.get('/v1.2/products', {
      params: {
        latitude,
        longitude,
      },
    });
    return response.data.products;
  }
}