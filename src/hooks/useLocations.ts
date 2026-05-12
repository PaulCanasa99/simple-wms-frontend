import { useQuery } from '@tanstack/react-query';
import { listLocations, listLocationsByRack } from '../api/locations';
import { qk } from './queryKeys';

export const useLocations = (options?: { refetchInterval?: number }) =>
  useQuery({
    queryKey: qk.locations,
    queryFn: listLocations,
    refetchInterval: options?.refetchInterval,
  });

export const useLocationsByRack = (rack: string | undefined) =>
  useQuery({
    queryKey: rack ? qk.locationsByRack(rack) : ['locations', 'rack', 'noop'],
    queryFn: () => listLocationsByRack(rack!),
    enabled: Boolean(rack),
  });
