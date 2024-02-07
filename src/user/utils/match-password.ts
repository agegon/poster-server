import { compare } from 'bcrypt';

export const matchPassword = (
  hash: string,
  password: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    compare(password, hash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};
