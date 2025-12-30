import crypto from 'node:crypto';

export function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function newJti() {
  return crypto.randomUUID();
}

export function toDateFromJwtExp(expSeconds) {
  return new Date(expSeconds * 1000);
}
