import { client } from './client';
import type { CsvImportResult, InboundOrder } from '../types/api';

export const listInboundOrders = async (): Promise<InboundOrder[]> => {
  const { data } = await client.get<InboundOrder[]>('/inboundOrders');
  return data;
};

export const getInboundOrder = async (id: string): Promise<InboundOrder> => {
  const { data } = await client.get<InboundOrder>(`/inboundOrders/${id}`);
  return data;
};

export const importInboundOrders = async (
  rows: unknown[],
): Promise<CsvImportResult> => {
  const { data } = await client.post<CsvImportResult>('/inboundOrders/import', {
    data: rows,
  });
  return data;
};
