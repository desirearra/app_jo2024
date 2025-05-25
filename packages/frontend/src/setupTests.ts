// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock pour crypto.randomUUID (pas disponible dans jsdom)
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid-' + Math.random().toString(36).substring(2, 15),
  },
});

// Mock simple pour IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock pour TextEncoder/TextDecoder
class MockTextEncoder implements TextEncoder {
  readonly encoding: string = 'utf-8';
  encode(input: string): Uint8Array {
    return new Uint8Array([...input].map(char => char.charCodeAt(0)));
  }
  encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult {
    const encoded = this.encode(source);
    destination.set(encoded);
    return { read: source.length, written: encoded.length };
  }
}

class MockTextDecoder implements TextDecoder {
  readonly encoding: string = 'utf-8';
  readonly fatal: boolean = false;
  readonly ignoreBOM: boolean = false;
  decode(): string {
    return '';
  }
}

global.TextEncoder = MockTextEncoder;
global.TextDecoder = MockTextDecoder;

// Configuration pour réduire les warnings React act() moins critiques
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Filtrer les warnings act() spécifiques qui sont gérés par nos tests
  const message = args[0];
  if (
    typeof message === 'string' &&
    message.includes('Warning: An update to') &&
    message.includes('inside a test was not wrapped in act')
  ) {
    // Ignorer ces warnings car nous les gérons avec act() et waitFor()
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  // Filtrer certains warnings moins critiques durant les tests
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('React Router') || message.includes('Warning: React Router'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

// Mock pour ResizeObserver (utilisé par Recharts et d'autres libs graphiques)
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
