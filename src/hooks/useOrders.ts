import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrder, importOrders, listOrders, outboundSelection } from '../api/orders';
import { qk } from './queryKeys';

export const useOrders = () =>
  useQuery({ queryKey: qk.orders, queryFn: listOrders });

export const useOrder = (id: string | undefined) =>
  useQuery({
    queryKey: id ? qk.order(id) : ['orders', 'noop'],
    queryFn: () => getOrder(id!),
    enabled: Boolean(id),
  });

export const useImportOrders = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: importOrders,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.orders });
    },
  });
};

export const useOutboundSelection = (orderId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productLineIds: string[]) =>
      outboundSelection(orderId!, productLineIds),
    onSuccess: () => {
      if (orderId) qc.invalidateQueries({ queryKey: qk.order(orderId) });
      qc.invalidateQueries({ queryKey: qk.orders });
      qc.invalidateQueries({ queryKey: qk.outboundOrders });
      qc.invalidateQueries({ queryKey: qk.handlingUnits });
    },
  });
};
