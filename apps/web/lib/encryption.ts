import CryptoJS from 'crypto-js';

export function encrypt(message: string, key: any): string {
  if (!message || !key) {
    throw new Error(`Message and key are required to encrypt ${message} \n\n ${key}`);
  }
  key = process.env.SOME_KEY as string;
  try {
    const encrypted = CryptoJS.AES.encrypt(message, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Error encrypting message:', error);
    throw error;
  }
}

export function decrypt(encrypted: string, key: string): string {
  if (!encrypted || !key) {
    throw new Error('Encrypted message and key are required');
  }
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw error;
  }
}
 