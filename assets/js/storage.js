/**
 * @fileoverview storage.js — Centralised localStorage abstraction.
 *
 * All localStorage keys live here. Consumers never touch localStorage directly.
 * Every method is wrapped in try/catch so private browsing / quota errors
 * are handled gracefully with a silent fallback.
 *
 * @module storage
 */

const KEYS = /** @type {const} */ ({
  PILGRIM:    'camino-pilgrim',
  CHECKLIST:  'camino-check',
  NIGHT_MODE: 'camino-night',
  GEAR_PREFIX: 'gear-',
  BLISTER_PREFIX: 'blister-',
  BOOKING: 'camino-booking',
});

// ─── Generic helpers ─────────────────────────────────────────────────────────

/**
 * Read a JSON value from localStorage.
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? /** @type {T} */ (JSON.parse(raw)) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Write a JSON value to localStorage.
 * @param {string} key
 * @param {unknown} value
 */
function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore quota / private browsing errors
  }
}

/**
 * Remove a key from localStorage.
 * @param {string} key
 */
function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch { /* noop */ }
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

export function clearSavedPilgrim() {
  remove(KEYS.PILGRIM);
}

// ─── Gear checklist (per pilgrim) ────────────────────────────────────────────

/**
 * @param {string} pilgrimId
 * @returns {Record<string, boolean>}
 */
export function getGearState(pilgrimId) {
  return getJSON(KEYS.GEAR_PREFIX + pilgrimId, {});
}

/**
 * @param {string} pilgrimId
 * @param {Record<string, boolean>} state
 */
export function setGearState(pilgrimId, state) {
  setJSON(KEYS.GEAR_PREFIX + pilgrimId, state);
}

/**
 * Toggle a single gear item and persist.
 * @param {string} pilgrimId
 * @param {string} key
 * @returns {boolean} New checked state
 */
export function toggleGearItem(pilgrimId, key) {
  const state = getGearState(pilgrimId);
  const newValue = !state[key];
  state[key] = newValue;
  setGearState(pilgrimId, state);
  return newValue;
}

// ─── Global checklist ────────────────────────────────────────────────────────

/** @returns {Record<string, boolean>} */
export function getChecklistState() {
  return getJSON(KEYS.CHECKLIST, {});
}

/**
 * @param {string} key  - `${catIdx}-${itemIdx}`
 * @returns {boolean} New checked state
 */
export function toggleChecklistItem(key) {
  const state = getChecklistState();
  const newValue = !state[key];
  state[key] = newValue;
  setJSON(KEYS.CHECKLIST, state);
  return newValue;
}

// ─── Blister meter (per pilgrim) ─────────────────────────────────────────────

/**
 * @param {string} pilgrimId
 * @returns {number}
 */
export function getBlisterValue(pilgrimId) {
  return getJSON(KEYS.BLISTER_PREFIX + pilgrimId, 0);
}

/**
 * @param {string} pilgrimId
 * @param {number} value
 */
export function setBlisterValue(pilgrimId, value) {
  setJSON(KEYS.BLISTER_PREFIX + pilgrimId, value);
}

// ─── Bookings ────────────────────────────────────────────────────────────────

/** @returns {Record<string, boolean>} */
export function getBookingState() {
  return getJSON(KEYS.BOOKING, {});
}

/**
 * @param {string} key  - `${dayIdx}-${albIdx}`
 * @returns {boolean} New booked state
 */
export function toggleBookingItem(key) {
  const state = getBookingState();
  const newValue = !state[key];
  state[key] = newValue;
  setJSON(KEYS.BOOKING, state);
  return newValue;
}

// ─── Night mode ───────────────────────────────────────────────────────────────

/** @returns {boolean|null} null = not set by user (auto-detect from hour) */
export function getNightModePreference() {
  return getJSON(KEYS.NIGHT_MODE, null);
}

/** @param {boolean} on */
export function setNightModePreference(on) {
  setJSON(KEYS.NIGHT_MODE, on);
}
