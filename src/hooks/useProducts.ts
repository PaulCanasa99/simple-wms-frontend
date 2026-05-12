import { useQuery } from '@tanstack/react-query';
import { getProduct, listProducts } from '../api/products';
import { qk } from './queryKeys';

export const useProducts = () =>
  useQuery({ queryKey: qk.products, queryFn: listProducts });

export const useProduct = (id: string | undefined) =>
  useQuery({
    queryKey: id ? qk.product(id) : ['products', 'noop'],
    queryFn: () => getProduct(id!),
    enabled: Boolean(id),
  });
