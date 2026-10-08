import crypto from 'crypto';
export const makeTrackingNumber = () => `PP-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
