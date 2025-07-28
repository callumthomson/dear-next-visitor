import Valkey from 'iovalkey';

export const valkey = new Valkey(process.env.VALKEY_URL!)
