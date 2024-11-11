import CryptoJS from 'crypto-js';
import { m } from 'framer-motion';

export function encrypt(message: string, key: any): string {
  if (!message || !key) {
    throw new Error(`Message and key are required to encrypt ${message} \n\n ${key as     string}`);
  }
  key = process.env.HASH_KEY as string;
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
  key = process.env.HASH_KEY as string;
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw error;
  }
}
 