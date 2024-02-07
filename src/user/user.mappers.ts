import { User } from './user.entity';
import { IUserSchema } from './user.interfaces';

export const mapUserSchema = (user: User): IUserSchema => {
  return {
    bio: user.bio,
    email: user.email,
    id: user.id,
    image: user.image,
    username: user.username,
  };
};
