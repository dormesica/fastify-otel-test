import { initializeWebServer, stopWebServer } from '../src/app.js';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

/**
 * @param {number} port
 * @param {Partial<{
*   prefix: string;
*   token: import('../../types/globals').AccessToken;
* }>} [opts]
*/
function createClient(port, opts) {
 const { prefix, token } = Object.assign(
   { prefix: '', token: JSON.stringify({}) },
   opts,
 );

 const axiosClient = axios.create({
   baseURL: `http://127.0.0.1:${port}${prefix}`,
   validateStatus: () => true,
   headers: {
     'x-ads-token-data': JSON.stringify(token),
   },
 });

 axiosClient.interceptors.response.use((res) => {
  //  expect(res).toSatisfyApiSpec();

   return res;
 });

 return axiosClient;
}

/** @type {import('axios').AxiosInstance} */
let axiosClient;

describe('request id', () => {
  beforeAll(async () => {
    const server = await initializeWebServer();

    axiosClient = createClient(server.getPort());
  });

  afterAll(async () => {
    await stopWebServer();
  });

  it('should return x-request-id header', async () => {
    const response = await axiosClient.get('/api/v1/health');

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.headers['x-request-id']).toStrictEqual(expect.any(String));
  });

  it('should get request id from x-request-id request header', async () => {
    const requestId = uuid();
    const response = await axiosClient.get('/api/v1/health', {
      headers: {
        'x-request-id': requestId,
      },
    });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.headers['x-request-id']).toBe(requestId);
  });
});
