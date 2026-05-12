import { client } from './client';
import type { CsvImportResult, Order } from '../types/api';

export const listOrders = async (): Promise<Order[]> => {
  const { data } = await client.get<Order[]>('/orders');
  return data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const { data } = await client.get<Order>(`/orders/${id}`);
  return data;
};

export const importOrders = async (rows: unknown[]): Promise<CsvImportResult> => {
  const { data } = await client.post<CsvImportResult>('/orders/import', {
    data: rows,
  });
  return data;
};

export const outboundSelection = async (
  orderId: string,
  productLineIds: string[],
): Promise<Order> => {
  const { data } = await client.post<Order>(`/orders/outboundSelection/${orderId}`, {
    data: productLineIds,
  });
  return data;
};
