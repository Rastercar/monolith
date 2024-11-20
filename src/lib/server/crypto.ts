import * as bycrypt from 'bcrypt';

export const hashSync = (data: string) => bycrypt.hashSync(data, 10);

export const compareSync = (data: string, encrypted: string) =>
	bycrypt.compareSync(data, encrypted);
