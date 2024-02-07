import { hash } from 'bcrypt';

import { USER_SALT_ROUNDS } from '../user.constants';

export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    hash(password, USER_SALT_ROUNDS, (err, encrypted) => {
      if (err) {
        return reject(err);
      }

      resolve(encrypted);
    });
  });
};
