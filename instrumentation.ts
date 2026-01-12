export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { MessagePort } = await import('node:worker_threads');
      if (!globalThis.MessagePort) {
        // @ts-ignore
        globalThis.MessagePort = MessagePort;
      }
    } catch (e) {
      console.warn("Failed to polyfill MessagePort", e);
    }

    if (!globalThis.FinalizationRegistry) {
      // @ts-ignore
      // biome-ignore lint/suspicious/noShadowRestrictedNames: Build errors... no more...
      globalThis.FinalizationRegistry = class FinalizationRegistry {
        constructor() { }
        register() { }
        unregister() { }
      };
    }
  }
}
