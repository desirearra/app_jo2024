import '@testing-library/jest-dom';

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

// @ts-expect-error - Mock implementation
global.TextEncoder = MockTextEncoder;
// @ts-expect-error - Mock implementation
global.TextDecoder = MockTextDecoder;

// Désactiver les avertissements de console non pertinents
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Ignorer certaines erreurs qui ne sont pas pertinentes pour les tests
  const suppressed = [
    'Warning: ReactDOM.render is no longer supported',
    'Invalid prop',
    'Failed prop type',
    'React does not recognize',
  ];

  if (typeof args[0] === 'string' && suppressed.some(msg => args[0].includes(msg))) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  // Ignorer certains avertissements qui ne sont pas pertinents pour les tests
  const suppressed = ['Warning: componentWill', 'React Router', 'forwardRef render functions'];

  if (typeof args[0] === 'string' && suppressed.some(msg => args[0].includes(msg))) {
    return;
  }
  originalConsoleWarn(...args);
};
