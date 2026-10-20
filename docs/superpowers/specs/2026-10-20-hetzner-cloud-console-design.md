# Hetzner Cloud Console — Mobile App Design

**Date:** 2026-10-20
**Project:** hetzner-cloud-console
**Repo:** github.com/rajasekharponakala/hetzner-cloud-console (public)
**Stack:** Expo SDK ~57, Expo Router, TypeScript, React Native 0.86 (New Arch)

## 1. Purpose & success criteria

A mobile (Android-first) client for the Hetzner Cloud API (`https://api.hetzner.cloud/v1`). Users paste a project API token once; the app stores it in `expo-secure-store` and lets them browse and manage cloud resources: Servers, Volumes, Networks, Firewalls, Load Balancers, Floating IPs, Primary IPs, SSH Keys, Images, Locations, Server Types, Placement Groups, Pricing.

Success criteria:

- App builds a debug APK in CI and a release APK on tag.
- All API calls go through one typed client with Bearer auth and error normalization.
- Token persists across launches; invalid token → re-prompt.
- Multi-account: store a list of named tokens in SecureStore; allow adding, removing, and switching the active account from a "Accounts" screen in the More tab.
- Core flows tested: token storage, client request, server list rendering.
- GitHub workflows: CI (lint/typecheck/test/bundle/native/prebuild-clean), CodeQL, Release APK, dependabot.

## 2. Architecture

Monorepo-lite single package (no workspaces) mirroring OmniClick layout but simpler:

```
hetzner-cloud-console/
├── app/                      # Expo Router routes
│   ├── _layout.tsx           # root layout, auth gate
│   ├── (auth)/token.tsx      # token entry
│   └── (tabs)/               # main tabs
│       ├── _layout.tsx
│       ├── servers/
│       ├── volumes/
│       ├── networks/
│       ├── firewalls/
│       ├── loadbalancers/
│       └── more/             # floating IPs, primary IPs, ssh keys, images, locations, types, pricing
├── src/
│   ├── api/                  # Hetzner client + per-resource modules
│   │   ├── client.ts
│   │   ├── servers.ts
│   │   ├── volumes.ts
│   │   ├── networks.ts
│   │   ├── firewalls.ts
│   │   ├── loadbalancers.ts
│   │   ├── floatingIps.ts
│   │   ├── primaryIps.ts
│   │   ├── sshKeys.ts
│   │   ├── images.ts
│   │   ├── locations.ts
│   │   ├── serverTypes.ts
│   │   ├── placementGroups.ts
│   │   └── pricing.ts
│   ├── auth/                 # token storage + multi-account helpers
│   │   └── accounts.ts
│   ├── components/           # shared UI
│   ├── hooks/                # data-fetching hooks (useServers, etc.)
│   └── types/                # Hetzner resource types
├── .github/workflows/        # ci.yml, codeql.yml, release-apk.yml
├── .github/dependabot.yml
├── app.json
├── package.json
├── tsconfig.json
├── .nvmrc
├── eslint.config.js
├── .prettierrc
└── README.md
```

## 3. Data flow

- `src/api/client.ts` exports `hcloud(token)` returning a fetch wrapper. Base URL `https://api.hetzner.cloud/v1`. Injects `Authorization: Bearer <token>`. Parses JSON, throws typed `HetznerError` on non-2xx with `{code,message,details}`.
- Per-resource modules call the client and return typed arrays/objects.
- Hooks (`useServers`) use `useState` + `useEffect` + manual refetch; no external data library (YAGNI). Loading/error states.
- Auth gate in root `_layout`: read token from SecureStore; if missing → redirect to `(auth)/token`.

## 4. Screens

- Token entry: text input + "Save" → validate via `GET /servers?per_page=1`; on success store + navigate tabs.
- Servers list: FlatList, pull-to-refresh, status badge, power state. Tap → detail (name, status, IP, type, location, metrics, actions: power on/off, reboot, reset, shutdown, delete).
- Create server modal: name, server type picker, image picker, location picker, SSH key picker (optional), network (optional).
- Volumes/Networks/Firewalls/LoadBalancers: list + detail + create/delete.
- More tab: Floating IPs, Primary IPs, SSH Keys, Images, Locations, Server Types, Placement Groups, Pricing (read-only-ish).

## 5. Error handling

- Network/parse errors → user-facing alert + retry.
- 401 → clear token, redirect to token entry.
- Destructive actions → confirmation dialog.

## 6. Testing

- Jest via Expo's default test runner? Use `jest-expo`. Unit tests for client (mock fetch), token storage, hooks.
- Keep tests focused on logic; smoke UI via CI bundle.

## 7. CI/CD

Mirror OmniClick: ci.yml (check + native debug APK + prebuild-clean), codeql.yml, release-apk.yml. dependabot weekly npm.

## 8. Out of scope (v1)

- Real-time metrics charts (basic text metrics ok).
- Push notifications.
- iOS build (Android focus; iOS config present for parity).

## 9. Decisions

- No Redux/Zustand; React state + hooks.
- No generated client from OpenAPI; hand-written typed modules for the used endpoints.
- Styling: StyleSheet + a small theme; no Tailwind (RN).
