import { client } from './client';
import type { AuthResponse } from '../types/api';

export const authenticate = async (email: string, password: string) => {
  const { data } = await client.post<AuthResponse>('/warehouseWorkers/authenticate', {
    data: { email, password },
  });
  return data;
};
