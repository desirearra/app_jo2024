import '@testing-library/jest-dom';

declare module 'expect' {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveTextContent(text: string): R;
  }
}
