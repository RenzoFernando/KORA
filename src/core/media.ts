import { cloudCall, blobBase64 } from './cloud';
const DB = 'korlambda-2-media';
async function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('files');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function localRead(key: string) {
  const db = await database();
  try {
    return await new Promise<Blob | undefined>((resolve, reject) => {
      const req = db.transaction('files').objectStore('files').get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}
export async function storeFile(_key: string, file: File) {
  const result = await cloudCall<{ key: string }>('media.upload', {
    mime:
      file.type === 'audio/x-m4a'
        ? 'audio/mp4'
        : file.type ||
          {
            mp3: 'audio/mpeg',
            wav: 'audio/wav',
            ogg: 'audio/ogg',
            m4a: 'audio/mp4',
            flac: 'audio/flac',
          }[file.name.split('.').pop()?.toLowerCase() || ''] ||
          '',
    name: file.name,
    base64: await blobBase64(file),
  });
  return result.key;
}
export async function readFile(key: string) {
  if (!key.startsWith('drive:')) return localRead(key);
  const result = await cloudCall<{ mime: string; base64: string }>('media.get', { key });
  return new Blob([Uint8Array.from(atob(result.base64), (c) => c.charCodeAt(0))], {
    type: result.mime,
  });
}
export async function deleteFiles(keys: string[]) {
  const remote = keys.filter((k) => k.startsWith('drive:'));
  if (remote.length) await cloudCall('media.delete', { keys: remote });
  const local = keys.filter((k) => !k.startsWith('drive:'));
  if (!local.length) return;
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('files', 'readwrite');
      for (const key of local) transaction.objectStore('files').delete(key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}
