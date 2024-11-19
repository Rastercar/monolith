import * as bycrypt from 'bcrypt';

export const hashSync = (s: string) => bycrypt.hashSync(s, 10);
