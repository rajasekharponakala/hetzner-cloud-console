jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (k: string) => store.get(k) ?? null),
    setItemAsync: jest.fn(async (k: string, v: string) => { store.set(k, v); }),
    deleteItemAsync: jest.fn(async (k: string) => { store.delete(k); }),
    __store: store,
  };
});
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  return {
    getItem: jest.fn(async (k: string) => store.get(k) ?? null),
    setItem: jest.fn(async (k: string, v: string) => { store.set(k, v); }),
    removeItem: jest.fn(async (k: string) => { store.delete(k); }),
    __store: store,
  };
});

import { loadAccounts, addAccount, removeAccount, getActiveAccount, setActiveId } from '../accounts';

describe('accounts', () => {
  beforeEach(async () => {
    const ss = require('expo-secure-store');
    ss.__store.clear();
  });

  it('starts empty', async () => {
    expect(await loadAccounts()).toEqual([]);
    expect(await getActiveAccount()).toBeNull();
  });

  it('adds account and sets active', async () => {
    const acc = await addAccount('main', 'tok1');
    expect(acc.label).toBe('main');
    const active = await getActiveAccount();
    expect(active?.id).toBe(acc.id);
    expect(active?.token).toBe('tok1');
  });

  it('removes account and switches active', async () => {
    const a = await addAccount('a', 't1');
    const b = await addAccount('b', 't2');
    await removeAccount(b.id);
    const accounts = await loadAccounts();
    expect(accounts.map((x) => x.id)).toEqual([a.id]);
    const active = await getActiveAccount();
    expect(active?.id).toBe(a.id);
  });
});
