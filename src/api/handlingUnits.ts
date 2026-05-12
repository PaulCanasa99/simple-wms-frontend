import { client } from './client';
import type { HandlingUnit } from '../types/api';

export const listHandlingUnits = async (): Promise<HandlingUnit[]> => {
  const { data } = await client.get<HandlingUnit[]>('/handlingUnits');
  return data;
};

export const listHandlingUnitsByProduct = async (
  productId: string,
): Promise<HandlingUnit[]> => {
  const { data } = await client.get<HandlingUnit[]>(`/handlingUnits/${productId}`);
  return data;
};

export const graspAssignTransport = async (
  ids: string[],
): Promise<HandlingUnit[]> => {
  const { data } = await client.post<HandlingUnit[]>(
    '/handlingUnits/graspAssignationTransport',
    { data: ids },
  );
  return data;
};
