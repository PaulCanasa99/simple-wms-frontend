import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  generateTransportOrders,
  getOutboundOrder,
  listOutboundOrders,
} from '../api/outboundOrders';
import { qk } from './queryKeys';

export const useOutboundOrders = (options?: { refetchInterval?: number }) =>
  useQuery({
    queryKey: qk.outboundOrders,
    queryFn: listOutboundOrders,
    refetchInterval: options?.refetchInterval,
  });

export const useOutboundOrder = (
  id: string | undefined,
  options?: { refetchInterval?: number },
) =>
  useQuery({
    queryKey: id ? qk.outboundOrder(id) : ['outboundOrders', 'noop'],
    queryFn: () => getOutboundOrder(id!),
    enabled: Boolean(id),
    refetchInterval: options?.refetchInterval,
  });

export const useGenerateTransportOrders = (outboundOrderId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (handlingUnitIds: string[]) =>
      generateTransportOrders(outboundOrderId!, handlingUnitIds),
    onSuccess: () => {
      if (outboundOrderId)
        qc.invalidateQueries({ queryKey: qk.outboundOrder(outboundOrderId) });
      qc.invalidateQueries({ queryKey: qk.outboundOrders });
      qc.invalidateQueries({ queryKey: qk.transportOrders });
      qc.invalidateQueries({ queryKey: qk.handlingUnits });
    },
  });
};
