import crypto from 'crypto';

export default function getSHA256Digest(str: string) {
    const hash = crypto.createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
}