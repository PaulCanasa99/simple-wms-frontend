import { client } from './client';
import type { Product } from '../types/api';

export const listProducts = async (): Promise<Product[]> => {
  const { data } = await client.get<Product[]>('/products');
  return data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const { data } = await client.get<Product>(`/products/${id}`);
  return data;
};
