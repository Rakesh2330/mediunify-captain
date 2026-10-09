// Safe LocalStorage utility to prevent QuotaExceededError and React crashes

export const safeGetItem = (key, fallback = null) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[SafeStorage] Error reading "${key}":`, err);
    return fallback;
  }
};

export const sanitizeDataForStorage = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(item => sanitizeSingleItem(item));
  }
  return sanitizeSingleItem(data);
};

const sanitizeSingleItem = (item) => {
  if (!item || typeof item !== 'object') return item;
  const clone = { ...item };
  const largeImageFields = [
    'proofImage',
    'pickupProofImage',
    'deliveryProofImage',
    'proofSignature'
  ];

  largeImageFields.forEach(field => {
    // If the image is a base64 data URI larger than 30,000 characters (~22KB),
    // replace with clean placeholder to protect localStorage quota.
    if (typeof clone[field] === 'string' && clone[field].startsWith('data:') && clone[field].length > 30000) {
      clone[field] = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';
    }
  });

  return clone;
};

export const safeSetItem = (key, value) => {
  if (typeof window === 'undefined') return false;
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(sanitizeDataForStorage(value));
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`[SafeStorage] QuotaExceeded or write error for "${key}". Attempting cleanup...`, err);
    try {
      if (typeof value === 'object' && value !== null) {
        let fallbackData = sanitizeDataForStorage(value);
        if (Array.isArray(fallbackData)) {
          // Prune array and completely strip all base64 images
          fallbackData = fallbackData.slice(0, 15).map(item => {
            const stripped = { ...item };
            ['proofImage', 'pickupProofImage', 'deliveryProofImage', 'proofSignature'].forEach(f => {
              if (typeof stripped[f] === 'string' && stripped[f].startsWith('data:')) {
                stripped[f] = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';
              }
            });
            return stripped;
          });
        }
        localStorage.setItem(key, JSON.stringify(fallbackData));
        return true;
      }
    } catch (innerErr) {
      console.error(`[SafeStorage] Storage quota critical, skipping localStorage save for "${key}". Operating in memory.`, innerErr);
      return false;
    }
  }
  return false;
};

export const safeRemoveItem = (key) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[SafeStorage] Error removing "${key}":`, err);
  }
};
