
// Constants for the cryptographic operations
const SALT_LENGTH_BYTES = 16;
const IV_LENGTH_BYTES = 12; // Recommended for AES-GCM
const PBKDF2_ITERATIONS = 100000;

// Helper function to convert a string to an ArrayBuffer
function strToArrayBuffer(str: string): ArrayBuffer {
  return new TextEncoder().encode(str);
}

// Helper function to convert an ArrayBuffer to a string
function arrayBufferToStr(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(buffer);
}

// Helper function to convert an ArrayBuffer to a Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper function to convert a Base64 string to an ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derives a key from a password and salt using PBKDF2
async function deriveKey(passwordKey: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts plaintext data with a key.
 * @param plainText The string data to encrypt.
 * @param key The password/key string.
 * @returns A Base64 encoded string containing salt, IV, and ciphertext.
 */
export async function encryptData(plainText: string, key: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
  const plainTextBuffer = strToArrayBuffer(plainText);

  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    strToArrayBuffer(key),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const aesKey = await deriveKey(passwordKey, salt);

  const cipherTextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    aesKey,
    plainTextBuffer
  );

  const combinedBuffer = new Uint8Array(salt.length + iv.length + cipherTextBuffer.byteLength);
  combinedBuffer.set(salt, 0);
  combinedBuffer.set(iv, salt.length);
  combinedBuffer.set(new Uint8Array(cipherTextBuffer), salt.length + iv.length);

  return arrayBufferToBase64(combinedBuffer.buffer);
}

/**
 * Decrypts ciphertext with a key.
 * @param cipherTextBase64 The Base64 encoded string of the encrypted data.
 * @param key The password/key string.
 * @returns The decrypted plaintext string.
 */
export async function decryptData(cipherTextBase64: string, key: string): Promise<string> {
  const combinedBuffer = base64ToArrayBuffer(cipherTextBase64);

  const salt = combinedBuffer.slice(0, SALT_LENGTH_BYTES);
  const iv = combinedBuffer.slice(SALT_LENGTH_BYTES, SALT_LENGTH_BYTES + IV_LENGTH_BYTES);
  const cipherTextBuffer = combinedBuffer.slice(SALT_LENGTH_BYTES + IV_LENGTH_BYTES);

  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    strToArrayBuffer(key),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const aesKey = await deriveKey(passwordKey, new Uint8Array(salt));

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      aesKey,
      cipherTextBuffer
    );
    return arrayBufferToStr(decryptedBuffer);
  } catch (error) {
    throw new Error('Decryption failed. Invalid key or corrupted data.');
  }
}
