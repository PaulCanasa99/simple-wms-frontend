let demoMode = false;
const listeners = new Set<(value: boolean) => void>();

export const setDemoMode = (value: boolean) => {
  demoMode = value;
  listeners.forEach((cb) => cb(value));
};

export const isDemoMode = () => demoMode;

export const subscribeDemoMode = (cb: (value: boolean) => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
