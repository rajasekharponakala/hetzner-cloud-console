import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Account {
  id: string;
  label: string;
  token: string;
}

const KEY = 'hcc_accounts';
const ACTIVE = 'hcc_active';

async function readRaw(key: string): Promise<string | null> {
  try {
    const v = await SecureStore.getItemAsync(key);
    if (v !== null) return v;
  } catch {}
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

async function writeRaw(key: string, value: string | null): Promise<void> {
  try {
    if (value === null) await SecureStore.deleteItemAsync(key);
    else await SecureStore.setItemAsync(key, value);
    return;
  } catch {}
  try {
    if (value === null) await AsyncStorage.removeItem(key);
    else await AsyncStorage.setItem(key, value);
  } catch {}
}

export async function loadAccounts(): Promise<Account[]> {
  const raw = await readRaw(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveAccounts(accounts: Account[]): Promise<void> {
  await writeRaw(KEY, JSON.stringify(accounts));
}

export async function addAccount(label: string, token: string): Promise<Account> {
  const accounts = await loadAccounts();
  const acc: Account = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    token,
  };
  accounts.push(acc);
  await saveAccounts(accounts);
  await setActiveId(acc.id);
  return acc;
}

export async function removeAccount(id: string): Promise<void> {
  const accounts = await loadAccounts();
  const next = accounts.filter((a) => a.id !== id);
  await saveAccounts(next);
  const active = await getActiveId();
  if (active === id) {
    await setActiveId(next.length ? next[0].id : null);
  }
}

export async function getActiveId(): Promise<string | null> {
  return readRaw(ACTIVE);
}

export async function setActiveId(id: string | null): Promise<void> {
  await writeRaw(ACTIVE, id);
}

export async function getActiveAccount(): Promise<Account | null> {
  const id = await getActiveId();
  if (!id) return null;
  const accounts = await loadAccounts();
  return accounts.find((a) => a.id === id) ?? null;
}

export async function updateAccount(
  id: string,
  patch: Partial<Pick<Account, 'label' | 'token'>>,
): Promise<void> {
  const accounts = await loadAccounts();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) return;
  accounts[idx] = { ...accounts[idx], ...patch };
  await saveAccounts(accounts);
}
