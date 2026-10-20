# Hetzner Cloud Console

React Native (Expo) Android app for the [Hetzner Cloud API](https://docs.hetzner.cloud/).

## Features

- Token auth with validation (stored in SecureStore).
- Multi-account support: add, switch, remove accounts.
- Browse/manage Servers (power on/off, reboot, shutdown, reset, delete, create).
- Volumes, Networks, Firewalls, Load Balancers, Floating/Primary IPs, SSH Keys, Images, Locations, Server Types, Placement Groups, Pricing.

## Setup

```bash
npm install
npm run start
```

Android: `npm run android` (requires Android SDK).

## Build

```bash
npm run prebuild:android
npm run gradlew -- assembleDebug
```

## Tests

```bash
npm test
npm run typecheck
npm run lint
```

## CI

Workflows in `.github/workflows`: CI (lint/typecheck/test/bundle/native/prebuild-clean), CodeQL, Release APK (on `v*` tags).
