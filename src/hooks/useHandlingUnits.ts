import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  graspAssignTransport,
  listHandlingUnits,
  listHandlingUnitsByProduct,
} from '../api/handlingUnits';
import { qk } from './queryKeys';

export const useHandlingUnits = (options?: { refetchInterval?: number }) =>
  useQuery({
    queryKey: qk.handlingUnits,
    queryFn: listHandlingUnits,
    refetchInterval: options?.refetchInterval,
  });

export const useHandlingUnitsByProduct = (productId: string | undefined) =>
  useQuery({
    queryKey: productId
      ? qk.handlingUnitsByProduct(productId)
      : ['handlingUnits', 'noop'],
    queryFn: () => listHandlingUnitsByProduct(productId!),
    enabled: Boolean(productId),
  });

export const useGraspAssign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: graspAssignTransport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.handlingUnits });
      qc.invalidateQueries({ queryKey: qk.locations });
      qc.invalidateQueries({ queryKey: qk.transportOrders });
    },
  });
};
