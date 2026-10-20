# Hetzner Cloud Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a React Native (Expo) Android app that manages Hetzner Cloud resources via the Hetzner Cloud API, with multi-account token storage, CI/CD workflows, and a public GitHub repo.

**Architecture:** Expo SDK ~57 + Expo Router file-based routing + TypeScript. One typed fetch client (`src/api/client.ts`) with Bearer auth and normalized errors; per-resource modules; React hooks for data; SecureStore-backed multi-account auth gate.

**Tech Stack:** Expo ~57.0, React 19.2, React Native 0.86 (New Arch), expo-router, expo-secure-store, TypeScript 6, Jest + jest-expo + @testing-library/react-native, ESLint + Prettier.

**Spec:** `docs/superpowers/specs/2026-10-20-hetzner-cloud-console-design.md`

## Global Constraints

- Node >=20, npm; Android SDK at ~/Android/Sdk; Java 17 for CI.
- Expo SDK ~57.0.26, React Native 0.86.3, React 19.2.3.
- TypeScript strict; `tsc --noEmit` must pass.
- API base URL `https://api.hetzner.cloud/v1`; auth header `Authorization: Bearer <token>`.
- Token storage key prefix `hcc_accounts`; active account id stored under `hcc_active`.
- No Redux/Zustand; React state + hooks.
- Destructive actions require confirmation dialog.
- 401 → clear active token and redirect to token entry.

## Review Focus

- A token that looks valid but is revoked (401 on first call) must not crash the app; it must clear storage and show token entry.
- Switching accounts must re-run all data hooks; stale data from previous account must not leak.
- Pagination: lists with >25 entries must fetch all pages or show "load more"; never silently truncate.
- Destructive server/volume deletion must be guarded by a confirmation; accidental tap must not delete.
- SecureStore unavailability (web/emulator) must fall back gracefully without throwing.

---

### Task 1: Scaffold project

**Files:**
- Create: `package.json`, `app.json`, `tsconfig.json`, `.nvmrc`, `.gitignore`, `.prettierrc`, `eslint.config.js`, `README.md`, `jest.config.js`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "hetzner-cloud-console",
  "version": "0.1.0",
  "main": "expo-router/entry",
  "private": true,
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "web": "expo start --web",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "bundle:android": "expo export --platform android --output-dir dist",
    "prebuild:android": "expo prebuild --platform android --no-install",
    "gradlew": "cd android && ./gradlew"
  },
  "dependencies": {
    "@expo/metro-runtime": "~57.0.16",
    "@react-native-async-storage/async-storage": "2.2.0",
    "expo": "~57.0.26",
    "expo-constants": "~57.0.20",
    "expo-linking": "~57.0.11",
    "expo-router": "~57.0.24",
    "expo-secure-store": "~15.0.8",
    "expo-status-bar": "~57.0.1",
    "expo-system-ui": "~57.0.4",
    "react": "19.2.3",
    "react-dom": "^19.2.3",
    "react-native": "0.86.3",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-web": "^0.21.3"
  },
  "devDependencies": {
    "@testing-library/react-native": "^13.3.3",
    "@types/jest": "^29.5.14",
    "@types/react": "~19.2.2",
    "eslint": "^9.0.0",
    "eslint-config-expo": "^10.0.0",
    "jest": "^29.7.0",
    "jest-expo": "~57.0.0",
    "prettier": "^3.3.0",
    "typescript": "~6.0.3"
  }
}
```

- [ ] **Step 2: Create app.json**

```json
{
  "expo": {
    "name": "Hetzner Cloud Console",
    "slug": "hetzner-cloud-console",
    "version": "0.1.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "scheme": "hetzner-cloud-console",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.rajasekharponakala.hetznercloudconsole"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#D50C2D"
      },
      "package": "com.rajasekharponakala.hetznercloudconsole"
    },
    "web": { "output": "static" },
    "plugins": ["expo-router", "expo-secure-store"],
    "experiments": { "typedRoutes": true }
  }
}
```

- [ ] **Step 3: Create tsconfig.json, .nvmrc, .gitignore, .prettierrc, eslint.config.js**

tsconfig.json:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"], "~/*": ["app/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

.nvmrc: `20`

.gitignore:
```
node_modules/
.expo/
dist/
android/
ios/
*.log
```

.prettierrc:
```json
{ "singleQuote": true, "trailingComma": "all", "printWidth": 100 }
```

eslint.config.js:
```js
const { defineConfig } = require('eslint-define-config');
module.exports = defineConfig([{ extends: ['expo'] }]);
```

(Use expo's flat config: `module.exports = [{ extends: ['expo'] }];`)

- [ ] **Step 4: npm install**

Run: `npm install` → expect success.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold expo project"
```

---

### Task 2: Hetzner types + client

**Files:**
- Create: `src/types/hetzner.ts`, `src/api/client.ts`, `src/api/__tests__/client.test.ts`

- [ ] **Step 1: Write failing client test**

```ts
import { createClient } from '../client';

describe('hcloud client', () => {
  it('sends bearer token and parses json', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ servers: [] }),
    });
    const client = createClient('tok', fetchMock as any);
    const res = await client.get('/servers');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.hetzner.cloud/v1/servers',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer tok' }) }),
    );
    expect(res).toEqual({ servers: [] });
  });

  it('throws HetznerError on 401', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { code: 'unauthorized', message: 'bad token' } }),
    });
    const client = createClient('tok', fetchMock as any);
    await expect(client.get('/servers')).rejects.toMatchObject({ status: 401, code: 'unauthorized' });
  });
});
```

- [ ] **Step 2: Run test → FAIL**

Run: `npx jest src/api/__tests__/client.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement types + client**

`src/types/hetzner.ts` — define Server, Volume, Network, Firewall, LoadBalancer, FloatingIp, PrimaryIp, SshKey, Image, Location, ServerType, PlacementGroup, Pricing, Action, HetznerError, Pagination types. (Full interfaces from OpenAPI subset used.)

`src/api/client.ts`:
```ts
export interface HetznerError extends Error { status: number; code: string; details?: unknown; }
export function createClient(token: string, fetchImpl: typeof fetch = fetch) {
  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetchImpl(`https://api.hetzner.cloud/v1${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data: any = null;
    try { data = await res.json(); } catch {}
    if (!res.ok) {
      const e: HetznerError = Object.assign(new Error(data?.error?.message ?? res.statusText), {
        status: res.status, code: data?.error?.code ?? 'unknown', details: data?.error?.details,
      });
      throw e;
    }
    return data as T;
  }
  return {
    get: <T>(p: string) => request<T>('GET', p),
    post: <T>(p: string, b?: unknown) => request<T>('POST', p, b),
    put: <T>(p: string, b?: unknown) => request<T>('PUT', p, b),
    delete: <T>(p: string) => request<T>('DELETE', p),
  };
}
```

- [ ] **Step 4: Run test → PASS**

- [ ] **Step 5: Commit**

---

### Task 3: Auth accounts storage

**Files:**
- Create: `src/auth/accounts.ts`, `src/auth/__tests__/accounts.test.ts`

Implement:
```ts
export interface Account { id: string; label: string; token: string; }
const KEY = 'hcc_accounts';
const ACTIVE = 'hcc_active';
// use SecureStore with try/catch fallback to AsyncStorage? Keep SecureStore primary.
export async function loadAccounts(): Promise<Account[]>
export async function saveAccounts(accounts: Account[]): Promise<void>
export async function addAccount(label: string, token: string): Promise<Account>
export async function removeAccount(id: string): Promise<void>
export async function getActiveId(): Promise<string | null>
export async function setActiveId(id: string | null): Promise<void>
export async function getActiveAccount(): Promise<Account | null>
```

Use `expo-secure-store`. Fallback: if SecureStore unavailable, use AsyncStorage. Implement try/catch.

Tests: mock SecureStore; add/remove/switch; active retrieval; fallback on throw.

- [ ] Steps TDD.

---

### Task 4: Root layout + auth gate + token entry

**Files:**
- Create: `app/_layout.tsx`, `app/(auth)/_layout.tsx`, `app/(auth)/token.tsx`, `app/(tabs)/_layout.tsx`

Root layout reads active account; if none → redirect to `/token`. Use `useSegments` + `router.replace`.

Token entry screen: TextInput for label + token; "Validate & Save" calls `createClient(token).get('/servers?per_page=1')`; on success addAccount + setActive + navigate tabs; on 401 show error.

Tabs layout: 6 tabs — Servers, Volumes, Networks, Firewalls, Load Balancers, More.

- [ ] Implement.

---

### Task 5: Shared UI components

**Files:**
- Create: `src/components/Button.tsx`, `Card.tsx`, `Badge.tsx`, `Loading.tsx`, `ErrorView.tsx`, `ConfirmDialog.tsx`

Simple styled components.

---

### Task 6: Resource modules + hooks

**Files:**
- Create: `src/api/servers.ts`, `volumes.ts`, `networks.ts`, `firewalls.ts`, `loadbalancers.ts`, `floatingIps.ts`, `primaryIps.ts`, `sshKeys.ts`, `images.ts`, `locations.ts`, `serverTypes.ts`, `placementGroups.ts`, `pricing.ts`
- Create: `src/hooks/useResource.ts`, `useServers.ts`, etc.

Each module: list/get/create/update/delete + actions. Hooks wrap with loading/error/refetch.

`useResource<T>(fetcher)` generic.

---

### Task 7: Servers screens

**Files:**
- Create: `app/(tabs)/servers/index.tsx`, `[id].tsx`, `create.tsx`

List with FlatList, pull-to-refresh, status badge. Detail with metrics + action buttons (power on/off, reboot, reset, shutdown, delete) with confirm. Create modal.

---

### Task 8: Volumes, Networks, Firewalls, Load Balancers screens

**Files:**
- Create directories + index/detail/create for each.

Simpler versions: list + detail + delete + create (basic fields).

---

### Task 9: More tab screens

**Files:**
- Create: `app/(tabs)/more/index.tsx` (menu), `accounts.tsx`, `floating-ips.tsx`, `primary-ips.tsx`, `ssh-keys.tsx`, `images.tsx`, `locations.tsx`, `server-types.tsx`, `placement-groups.tsx`, `pricing.tsx`

---

### Task 10: Tests

**Files:**
- Create: `src/auth/__tests__/accounts.test.ts` (already Task3), `src/hooks/__tests__/useServers.test.ts`, `app` smoke via bundle.

Add hook tests.

---

### Task 11: GitHub workflows + dependabot

**Files:**
- Create: `.github/workflows/ci.yml`, `codeql.yml`, `release-apk.yml`, `.github/dependabot.yml`

Copy OmniClick versions, adjust paths (root, not apps/mobile). prebuild path `android`. artifact paths `android/app/build/outputs/...`.

dependabot:
```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule: { interval: weekly }
  - package-ecosystem: github-actions
    directory: /
    schedule: { interval: weekly }
```

---

### Task 12: README

Document setup, token, build, workflows.

---

### Task 13: Create GitHub repo + push

- `gh repo create rajasekharponakala/hetzner-cloud-console --public --source=. --remote=origin --push`
- Tag v0.1.0 to trigger release? Optional. We'll push main; maybe tag later.

---

## Execution

After plan approval, implement task-by-task with commits. Use executing-plans or subagent-driven.

Plan complete and saved to `docs/superpowers/plans/2026-10-20-hetzner-cloud-console.md`. Please review the plan. Which execution approach would you prefer?

- **Subagent-driven** - fresh subagent per task + review.
- **Native** - I implement all tasks in this session, then one review.

For this plan I recommend **Native**, because tasks share many interfaces and the plan is large; native avoids context churn and keeps consistency. Does the plan capture what you want, and which approach should we use?
