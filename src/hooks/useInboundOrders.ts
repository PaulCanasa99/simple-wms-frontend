import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getInboundOrder,
  importInboundOrders,
  listInboundOrders,
} from '../api/inboundOrders';
import { qk } from './queryKeys';

export const useInboundOrders = () =>
  useQuery({ queryKey: qk.inboundOrders, queryFn: listInboundOrders });

export const useInboundOrder = (id: string | undefined) =>
  useQuery({
    queryKey: id ? qk.inboundOrder(id) : ['inboundOrders', 'noop'],
    queryFn: () => getInboundOrder(id!),
    enabled: Boolean(id),
  });

export const useImportInboundOrders = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: importInboundOrders,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.inboundOrders });
      qc.invalidateQueries({ queryKey: qk.handlingUnits });
    },
  });
};
