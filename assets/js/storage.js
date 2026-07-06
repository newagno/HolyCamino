/**
 * @fileoverview storage.js — Centralised storage abstraction using IndexedDB Write-Behind Cache.
 *
 * Implements a memory cache for instantaneous synchronous reads/writes by the UI,
 * while asynchronously flushing changes to IndexedDB to prevent main-thread blocking.
 * Handles automatic migration from localStorage on first boot.
 *
 * @module storage
 */

const DB_NAME = 'CaminoDB';
const DB_VERSION = 2;
const STATE_STORE = 'stateStore';
const CACHE_STORE = 'cacheStore';

const KEYS = /** @type {const} */ ({
  PILGRIM:    'camino-pilgrim',
  CHECKLIST:  'camino-check',
  NIGHT_MODE: 'camino-night',
  GEAR_PREFIX: 'gear-',
  BLISTER_PREFIX: 'blister-',
  BOOKING: 'camino-booking',
});

let db = null;
let memoryCache = {};
const pendingWrites = new Map(); // key -> setTimeout ID

// ─── IndexedDB Core ──────────────────────────────────────────────────────────

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STATE_STORE)) {
        database.createObjectStore(STATE_STORE);
      }
      if (!database.objectStoreNames.contains(CACHE_STORE)) {
        database.createObjectStore(CACHE_STORE);
      }
      if (!database.objectStoreNames.contains('errorStore')) {
        database.createObjectStore('errorStore', { autoIncrement: true });
      }
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };
    request.onerror = (event) => reject(event.target.error);
  });
}

/**
 * Executes a transaction on the given store.
 */
function execTx(storeName, mode, callback) {
  return new Promise(async (resolve, reject) => {
    try {
      const database = await openDB();
      const tx = database.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      
      let result = null;
      tx.oncomplete = () => resolve(result);
      tx.onerror = (e) => reject(e.target.error);
      
      result = callback(store);
    } catch (err) {
      reject(err);
    }
  });
}

// ─── Migration & Initialisation ──────────────────────────────────────────────

/**
 * Must be called during app boot BEFORE rendering.
 * Migrates localStorage to IDB stateStore synchronously (blocking),
 * then populates the memoryCache.
 */
export async function initStorage() {
  try {
    await openDB();

    // 0. Check for Lifeboat Recovery (iOS Safari fix)
    const lifeboatRaw = localStorage.getItem('camino_lifeboat');
    if (lifeboatRaw) {
      console.log('Lifeboat found! Recovering pending writes...');
      try {
        const lifeboatData = JSON.parse(lifeboatRaw);
        await execTx(STATE_STORE, 'readwrite', (store) => {
          for (const key of Object.keys(lifeboatData)) {
            if (lifeboatData[key] === undefined) {
               store.delete(key);
            } else {
               store.put(lifeboatData[key], key);
            }
          }
        });
        localStorage.removeItem('camino_lifeboat');
      } catch (e) {
        console.error('Lifeboat recovery failed:', e);
      }
    }

    // 1. Check if localStorage has items to migrate
    if (localStorage.length > 0) {
      console.log('Migrating localStorage to IndexedDB...');
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STATE_STORE, 'readwrite');
        const store = tx.objectStore(STATE_STORE);
        
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const rawValue = localStorage.getItem(key);
          try {
            store.put(JSON.parse(rawValue), key);
          } catch (e) {
            store.put(rawValue, key);
          }
        }
      });
      // 2. Clear localStorage ONLY after successful transaction commit
      localStorage.clear();
      console.log('Migration complete. localStorage cleared.');
    }

    // 3. Load entire stateStore into memoryCache
    const allKeysAndValues = await execTx(STATE_STORE, 'readonly', (store) => {
      return new Promise((res, rej) => {
        const request = store.getAll();
        const keysRequest = store.getAllKeys();
        
        request.onsuccess = () => {
          keysRequest.onsuccess = () => {
            const result = {};
            for (let i = 0; i < keysRequest.result.length; i++) {
              result[keysRequest.result[i]] = request.result[i];
            }
            res(result);
          };
          keysRequest.onerror = (e) => rej(e.target.error);
        };
        request.onerror = (e) => rej(e.target.error);
      });
    });

    memoryCache = allKeysAndValues || {};
    
  } catch (err) {
    console.error('Failed to initialize storage:', err);
    // Fallback: memoryCache is empty, app will function statelessly during session
    memoryCache = {}; 
  }
}

// ─── Debounced Writes & Flush ────────────────────────────────────────────────

/**
 * Schedules an asynchronous write to IDB stateStore with a 500ms debounce.
 */
function scheduleWrite(key) {
  if (pendingWrites.has(key)) {
    clearTimeout(pendingWrites.get(key));
  }
  
  const timer = setTimeout(() => {
    executeWrite(key);
    pendingWrites.delete(key);
  }, 500);
  
  pendingWrites.set(key, timer);
}

/**
 * Actually writes the current memoryCache value for a key to IDB.
 */
async function executeWrite(key) {
  try {
    const value = memoryCache[key];
    await execTx(STATE_STORE, 'readwrite', (store) => {
      if (value === undefined) {
        store.delete(key);
      } else {
        store.put(value, key);
      }
    });
  } catch (err) {
    console.error(`Failed to write key ${key} to IDB:`, err);
  }
}
let isFlushing = false;

/**
 * Instantly flushes all pending debounced writes to IDB.
 * Intercepts timers and forces async IndexedDB execution immediately.
 * Called on visibilitychange to prevent data loss.
 * Implements Synchronous Lifeboat to localStorage for iOS Safari.
 */
export function flushPendingWrites() {
  if (pendingWrites.size === 0 || isFlushing) return;
  isFlushing = true;
  
  // Synchronous Dump to localStorage for iOS Force-Quit resilience
  const lifeboatData = {};
  pendingWrites.forEach((_, key) => {
    lifeboatData[key] = memoryCache[key];
  });
  try {
    localStorage.setItem('camino_lifeboat', JSON.stringify(lifeboatData));
  } catch (e) { /* Ignore quota errors */ }

  const promises = [];
  pendingWrites.forEach((timer, key) => {
    clearTimeout(timer);
    promises.push(executeWrite(key));
  });
  pendingWrites.clear();

  // If async IndexedDB writes succeed, clean up the lifeboat
  Promise.all(promises).then(() => {
    try {
      localStorage.removeItem('camino_lifeboat');
    } catch(e) {}
  }).finally(() => {
    isFlushing = false;
  });
}

// ─── Generic Helpers (State Store) ───────────────────────────────────────────

/**
 * Read a JSON value synchronously from memory cache.
 */
function getJSON(key, fallback) {
  const val = memoryCache[key];
  return val !== undefined ? val : fallback;
}

/**
 * Write a JSON value to memory cache and schedule a background IDB update.
 */
function setJSON(key, value) {
  memoryCache[key] = value;
  scheduleWrite(key);
}

/**
 * Remove a key from memory cache and schedule a background IDB delete.
 */
function remove(key) {
  memoryCache[key] = undefined;
  scheduleWrite(key);
}

// ─── Future API Cache Helpers ────────────────────────────────────────────────

/**
 * Read asynchronously from the cacheStore (e.g. for Open-Meteo).
 */
export async function getCache(key) {
  try {
    return await execTx(CACHE_STORE, 'readonly', (store) => {
      return new Promise((res, rej) => {
        const req = store.get(key);
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
      });
    });
  } catch {
    return null;
  }
}

/**
 * Write asynchronously to the cacheStore.
 */
export async function setCache(key, value) {
  try {
    await execTx(CACHE_STORE, 'readwrite', (store) => {
      store.put(value, key);
    });
  } catch (err) {
    console.error(`Failed to write cache ${key}:`, err);
  }
}


// ─── Pilgrim session ─────────────────────────────────────────────────────────

/** @returns {string|null} Saved pilgrim ID or null */
export function getSavedPilgrim() {
  return getJSON(KEYS.PILGRIM, null);
}

/** @param {string} id */
export function setSavedPilgrim(id) {
  setJSON(KEYS.PILGRIM, id);
}

export async function clearSavedPilgrim() {
  memoryCache[KEYS.PILGRIM] = undefined;
  try {
    await execTx(STATE_STORE, 'readwrite', (store) => {
      store.delete(KEYS.PILGRIM);
    });
  } catch(e) {}
}

// ─── Gear checklist (per pilgrim) ────────────────────────────────────────────

export function getGearState(pilgrimId) {
  return getJSON(KEYS.GEAR_PREFIX + pilgrimId, {});
}

export function setGearState(pilgrimId, state) {
  setJSON(KEYS.GEAR_PREFIX + pilgrimId, state);
}

export function toggleGearItem(pilgrimId, key) {
  const state = getGearState(pilgrimId);
  const newValue = !state[key];
  state[key] = newValue;
  setGearState(pilgrimId, state);
  return newValue;
}

// ─── Global checklist ────────────────────────────────────────────────────────

export function getChecklistState() {
  return getJSON(KEYS.CHECKLIST, {});
}

export function toggleChecklistItem(key) {
  const state = getChecklistState();
  const newValue = !state[key];
  state[key] = newValue;
  setJSON(KEYS.CHECKLIST, state);
  return newValue;
}

// ─── Blister meter (per pilgrim) ─────────────────────────────────────────────

export function getBlisterValue(pilgrimId) {
  return getJSON(KEYS.BLISTER_PREFIX + pilgrimId, 0);
}

export function setBlisterValue(pilgrimId, value) {
  setJSON(KEYS.BLISTER_PREFIX + pilgrimId, value);
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export function getBookingState() {
  return getJSON(KEYS.BOOKING, {});
}

export function toggleBookingItem(key) {
  const state = getBookingState();
  const newValue = !state[key];
  state[key] = newValue;
  setJSON(KEYS.BOOKING, state);
  return newValue;
}

// ─── Night mode ───────────────────────────────────────────────────────────────

export function getNightModePreference() {
  return getJSON(KEYS.NIGHT_MODE, null);
}

export function setNightModePreference(on) {
  setJSON(KEYS.NIGHT_MODE, on);
}

// ─── Field Debugger ─────────────────────────────────────────────────────

/**
 * Write an error object to errorStore (autoIncrement key).
 * @param {{ timestamp: number, type: string, message: string, stack: string }} errorData
 */
export async function logErrorToDB(errorData) {
  try {
    await execTx('errorStore', 'readwrite', (store) => {
      store.add(errorData);
    });
  } catch {
    // Silently fail — logger must never throw
  }
}

/**
 * Read all records from errorStore, sorted newest-first.
 * @returns {Promise<Array>}
 */
export async function getErrorsFromDB() {
  try {
    return await execTx('errorStore', 'readonly', (store) => {
      return new Promise((res, rej) => {
        const req = store.getAll();
        req.onsuccess = () => res(req.result);
        req.onerror  = () => rej(req.error);
      });
    }) ?? [];
  } catch {
    return [];
  }
}

/**
 * Delete all records from errorStore.
 */
export async function clearErrorsFromDB() {
  try {
    await execTx('errorStore', 'readwrite', (store) => {
      store.clear();
    });
  } catch {
    // Silently fail
  }
}
