import { buildSeed, type MockState } from './seed';

const STORAGE_KEY = 'wms.mock.db.v1';

const load = (): MockState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MockState;
  } catch {
    /* fall through */
  }
  const fresh = buildSeed();
  save(fresh);
  return fresh;
};

const save = (state: MockState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* no-op */
  }
};

let state: MockState = load();

export const db = {
  get state(): MockState {
    return state;
  },
  mutate(fn: (state: MockState) => void) {
    fn(state);
    save(state);
  },
  reset() {
    state = buildSeed();
    save(state);
  },
};
