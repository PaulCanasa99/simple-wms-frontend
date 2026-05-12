import { client } from './client';
import type { TransportOrder } from '../types/api';

export const listTransportOrders = async (): Promise<TransportOrder[]> => {
  const { data } = await client.get<TransportOrder[]>('/transportOrders');
  return data;
};
