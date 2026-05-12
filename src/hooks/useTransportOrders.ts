import { useQuery } from '@tanstack/react-query';
import { listTransportOrders } from '../api/transportOrders';
import { qk } from './queryKeys';

export const useTransportOrders = (options?: { refetchInterval?: number }) =>
  useQuery({
    queryKey: qk.transportOrders,
    queryFn: listTransportOrders,
    refetchInterval: options?.refetchInterval,
  });
