import { client } from './client';
import type { Location } from '../types/api';

export const listLocations = async (): Promise<Location[]> => {
  const { data } = await client.get<Location[]>('/locations');
  return data;
};

export const listLocationsByRack = async (rack: string): Promise<Location[]> => {
  const { data } = await client.get<Location[]>(`/locations/${rack}`);
  return data;
};
