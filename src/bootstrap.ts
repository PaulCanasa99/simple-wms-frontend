import { client, hasRealApi } from './api/client';
import { setDemoMode } from './demo';

const HEALTH_TIMEOUT_MS = 1500;

const apiHealthy = async (): Promise<boolean> => {
  if (!hasRealApi) return false;
  try {
    await client.get('/locations', { timeout: HEALTH_TIMEOUT_MS });
    return true;
  } catch {
    return false;
  }
};

export const startApp = async (): Promise<boolean> => {
  const forceDemo = import.meta.env.VITE_DEMO_MODE === 'true';
  const useMocks = forceDemo || !(await apiHealthy());

  if (useMocks) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
    setDemoMode(true);
  } else {
    setDemoMode(false);
  }

  return useMocks;
};
