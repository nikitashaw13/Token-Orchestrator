const keys = new Map();
const blockedKeys = new Map();
const availablekeys = new Map();
const KEY_LIFETIME = 5 * 60 * 1000;
const BLOCK_TIMEOUT = 60 * 1000;
let currentKey = 1;

const generateNewKey = async () => {
  const key = currentKey++;
  const timeoutId = setTimeout(() => {
    if (keys.has(key)) {
      keys.delete(key);
    }
  }, KEY_LIFETIME);
  keys.set(key, { isBlocked: false, createdAt: Date.now(), blockedAt: 0, timeoutId });
  availablekeys.set(key, { isBlocked: false, createdAt: Date.now(), blockedAt: 0, timeoutId });
  return key;
};

const retrieveKey = async () => {
  if (availablekeys.size === 0) return null;
  const key = availablekeys.keys().next().value;
  const value = keys.get(key);
  value.isBlocked = true;
  value.blockedAt = Date.now();

  availablekeys.delete(key);
  blockedKeys.set(key, value);
  console.log(key);

  setTimeout(() => {
    if (blockedKeys.has(key) && blockedKeys.get(key).isBlocked) {
      blockedKeys.get(key).isBlocked = false;
      availablekeys.set(key, blockedKeys.get(key).createdAt);
      blockedKeys.delete(key);
    }
  }, BLOCK_TIMEOUT);

  return key;
};

const fetchInfo = async (id) => {
  if (keys.has(id)) {
    const { isBlocked, blockedAt, createdAt } = keys.get(id);
    return { isBlocked, blockedAt, createdAt };
  }
  return null;
};

const removeKey = (key) => {
  if (keys.has(key)) {
    keys.delete(key);
    availablekeys.delete(key);
    blockedKeys.delete(key);
    return true;
  }
  return null;
};

const keepAliveKey = async (key) => {
  if (keys.has(key)) {
    const value = keys.get(key);
    clearTimeout(keys.get(key).timeoutId);
    const timeoutId = setTimeout(() => {
      value.createdAt = Date.now();
      value.timeoutId = timeoutId;
      keys.set(key, value);
    });
    return { key, value };
  }
  return null;
};

const unblockKey = async (key) => {
  if (blockedKeys.has(key)) {
    const value = keys.get(key);
    value.isBlocked = false;
    value.blockedAt = 0;

    availablekeys.set(key, value.createdAt);
    blockedKeys.delete(key);

    setTimeout(() => {
      if (keys.has(key) && !keys.get(key).isBlocked) {
        keys.delete(key);
        availablekeys.delete(key);
      }
    }, KEY_LIFETIME);

    return `key unblocked : ${key}`;
  }
  return null;
};

module.exports = {
  generateNewKey,
  retrieveKey,
  fetchInfo,
  removeKey,
  unblockKey,
  keepAliveKey,
};
