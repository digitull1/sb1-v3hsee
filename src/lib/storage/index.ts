import { get, set, del } from 'idb-keyval';

export async function getStorageItem<T>(key: string): Promise<T | null> {
  try {
    const value = await get<T>(key);
    return value || null;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return null;
  }
}

export async function setStorageItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await set(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
    return false;
  }
}

export async function removeStorageItem(key: string): Promise<boolean> {
  try {
    await del(key);
    return true;
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
    return false;
  }
}

export async function clearStorage(): Promise<boolean> {
  try {
    const keys = ['user', 'messages', 'achievements', 'topicState'];
    await Promise.all(keys.map(key => del(key)));
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}