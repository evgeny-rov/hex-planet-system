export const hexToBase10 = (value: string) => parseInt(value, 16);

export const arrayBufferToHex = (buffer: ArrayBuffer, separator = '') => {
  return new Uint8Array(buffer)
    .reduce<string[]>((a, b) => [...a, b.toString(16).padStart(2, '0')], [])
    .join(separator);
};

export const computeHash = async (data: ArrayBuffer) => {
  const result = await window.crypto.subtle.digest('sha-256', data);
  return arrayBufferToHex(result, '');
};

export const createRandomHash = async () => {
  const rawData = window.crypto.getRandomValues(new Uint8Array(12));
  const hash = await computeHash(rawData);

  return hash;
};

export const splitIntoChunks = (str: string, size: number) =>
  str.match(new RegExp(`.{1,${size}}`, 'g')) || [];

export const shortenHash = (hash: string) => {
  const octets = splitIntoChunks(hash, 2);

  let result = hexToBase10(octets[0]);

  for (let i = 1; i < octets.length; i++) {
    const num = hexToBase10(octets[i]);

    result = (result << 5) - result + num;
    result |= 0;
  }

  return Math.abs(result) % 1000;
};
