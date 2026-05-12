import { client } from './client';
import type { OutboundOrder, TransportOrder } from '../types/api';

export const listOutboundOrders = async (): Promise<OutboundOrder[]> => {
  const { data } = await client.get<OutboundOrder[]>('/outboundOrders');
  return data;
};

export const getOutboundOrder = async (id: string): Promise<OutboundOrder> => {
  const { data } = await client.get<OutboundOrder>(`/outboundOrders/${id}`);
  return data;
};

export const generateTransportOrders = async (
  outboundOrderId: string,
  handlingUnitIds: string[],
): Promise<TransportOrder[]> => {
  const { data } = await client.post<TransportOrder[]>(
    `/outboundOrders/generateTransportOrders/${outboundOrderId}`,
    { data: handlingUnitIds },
  );
  return data;
};
