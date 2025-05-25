import { generateFinalKey, generateOrderKey2, generateUserKey1 } from '../utils';

describe('generateUserKey1', () => {
  beforeAll(() => {
    // Mock uniquement la méthode digest
    if (!window.crypto) {
      (window as unknown as { crypto: unknown }).crypto = {} as unknown;
    }
    if (!window.crypto.subtle) {
      (window.crypto as unknown as { subtle: unknown }).subtle = {} as unknown;
    }
    if (!window.crypto.subtle.digest) {
      (window.crypto.subtle as unknown as { digest: unknown }).digest = async () =>
        new ArrayBuffer(0);
    }
    jest.spyOn(window.crypto.subtle, 'digest').mockImplementation(async () => {
      return new Uint8Array([1, 2, 3, 4, 5]).buffer;
    });
  });

  it('génère une clé1 hashée à partir des infos utilisateur', async () => {
    const email = 'test@email.com';
    const id = 'USR-123';
    const date = '2024-06-01T12:00:00.000Z';
    const key1 = await generateUserKey1(email, id, date);
    expect(key1).toBe('0102030405');
  });
});

describe('generateOrderKey2', () => {
  beforeAll(() => {
    // Mock uniquement la méthode digest
    if (!window.crypto) {
      (window as unknown as { crypto: unknown }).crypto = {} as unknown;
    }
    if (!window.crypto.subtle) {
      (window.crypto as unknown as { subtle: unknown }).subtle = {} as unknown;
    }
    if (!window.crypto.subtle.digest) {
      (window.crypto.subtle as unknown as { digest: unknown }).digest = async () =>
        new ArrayBuffer(0);
    }
    jest.spyOn(window.crypto.subtle, 'digest').mockImplementation(async () => {
      return new Uint8Array([6, 7, 8, 9, 10]).buffer;
    });
  });

  it('génère une clé2 hashée à partir des infos commande', async () => {
    const id = 'CMD-456';
    const date = '2024-06-15T10:30:00.000Z';
    const total = '250€';
    const key2 = await generateOrderKey2(id, date, total);
    expect(key2).toBe('060708090a');
  });
});

describe('generateFinalKey', () => {
  beforeAll(() => {
    // Mock uniquement la méthode digest
    if (!window.crypto) {
      (window as unknown as { crypto: unknown }).crypto = {} as unknown;
    }
    if (!window.crypto.subtle) {
      (window.crypto as unknown as { subtle: unknown }).subtle = {} as unknown;
    }
    if (!window.crypto.subtle.digest) {
      (window.crypto.subtle as unknown as { digest: unknown }).digest = async () =>
        new ArrayBuffer(0);
    }
    jest.spyOn(window.crypto.subtle, 'digest').mockImplementation(async () => {
      return new Uint8Array([11, 12, 13, 14, 15]).buffer;
    });
  });

  it('génère une clé finale hashée à partir de clé1 et clé2', async () => {
    const key1 = 'abc123';
    const key2 = 'def456';
    const finalKey = await generateFinalKey(key1, key2);
    expect(finalKey).toBe('0b0c0d0e0f');
  });
});
