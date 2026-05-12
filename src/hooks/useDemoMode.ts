import { useEffect, useState } from 'react';
import { isDemoMode, subscribeDemoMode } from '../demo';

export const useDemoMode = () => {
  const [enabled, setEnabled] = useState(isDemoMode());
  useEffect(() => subscribeDemoMode(setEnabled), []);
  return enabled;
};
