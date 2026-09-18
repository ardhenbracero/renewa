// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Required for expo-sqlite's web (browser) support to resolve its
// worker bundle correctly. Without this, running the app with `w`
// (web target) throws "Worker chunk not found for: .../expo-sqlite/web/worker.ts".
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
